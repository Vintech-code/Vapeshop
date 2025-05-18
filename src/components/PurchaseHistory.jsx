import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiFileText, FiCheckCircle, FiDownload, FiCalendar } from 'react-icons/fi';
import SideMenu from './SideMenu';

// Utility functions
const getMonthYear = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
const getMonthLabel = (date) => {
  const d = new Date(date);
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
};
const getAllMonths = (orders) => {
  // Get all unique months with transactions
  const months = Array.from(
    new Set(
      orders.map((o) => getMonthYear(o.createdAt))
    )
  ).sort();
  return months;
};
const getAllYears = (orders) => {
  // Get all unique years with transactions
  const years = Array.from(
    new Set(
      orders.map((o) => new Date(o.createdAt).getFullYear())
    )
  ).sort();
  return years;
};

const monthNames = [
  'January','February','March','April','May','June','July','August','September','October','November','December'
];

const mockSuppliers = [
  { id: 1, name: 'Vape Supplier Inc.', contact: '0917-123-4567', email: 'info@vapesupplier.com', history: [1, 3] },
  { id: 2, name: 'Juice World', contact: '0917-987-6543', email: 'orders@juiceworld.com', history: [2, 4] },
];

const mockPurchaseOrders = [
  {
    id: 'PO-20250420-001',
    createdAt: '2025-04-20T14:30:00',
    supplierId: 1,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    invoice: '/invoices/PO-20250420-001.pdf',
    notes: 'Urgent delivery requested.',
    approvalLogs: [
      { user: 'Manager', action: 'Approved', timestamp: '2025-04-19T10:00:00' },
    ],
    tax: 50,
    discount: 100,
    products: [
      {
        name: 'Vape Pen',
        category: 'Device',
        variant: 'Standard',
        flavor: '',
        nicotine: '',
        quantityOrdered: 2,
        quantityReceived: 2,
        cost: 500,
        total: 1000,
        image: '/img/vape pen2.jpg',
        discrepancy: '',
      },
      // ...other products...
    ],
    returns: [],
  },
  {
    id: 'PO-20250425-009',
    createdAt: '2025-04-25T10:15:00',
    supplierId: 2,
    paymentMethod: 'Cash',
    status: 'Completed',
    invoice: '/invoices/PO-20250425-009.pdf',
    notes: 'Standard delivery.',
    approvalLogs: [
      { user: 'Supervisor', action: 'Approved', timestamp: '2025-04-24T09:00:00' },
    ],
    tax: 80,
    discount: 50,
    products: [
      {
        name: 'Vape Pen Mini',
        category: 'Device',
        variant: 'Mini',
        flavor: '',
        nicotine: '',
        quantityOrdered: 3,
        quantityReceived: 3,
        cost: 400,
        total: 1200,
        image: '/img/Vape pen.jpg',
        discrepancy: '',
      },
      // ...other products...
    ],
    returns: [],
  }
];

const getSupplier = (id) => mockSuppliers.find((s) => s.id === id);

const formatDate = (dt) => {
  const d = new Date(dt);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const PurchaseHistory = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [showDetails, setShowDetails] = useState(null);

  // Calendar state for filtering purchase orders
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Calendar state for calendar view
  const [calendarYear, setCalendarYear] = useState('');
  const [calendarMonth, setCalendarMonth] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPurchaseOrders(mockPurchaseOrders);
      setIsLoading(false);
    }, 500);
  }, []);

  // Get all years and months with transactions
  const yearsWithOrders = getAllYears(purchaseOrders);
  const monthsWithOrders = getAllMonths(
    selectedYear
      ? purchaseOrders.filter((o) => new Date(o.createdAt).getFullYear().toString() === selectedYear)
      : purchaseOrders
  );

  // Set default year/month if not set for filtering
  useEffect(() => {
    if (yearsWithOrders.length && !selectedYear) {
      setSelectedYear(yearsWithOrders[yearsWithOrders.length - 1].toString());
    }
  }, [yearsWithOrders, selectedYear]);
  useEffect(() => {
    if (monthsWithOrders.length && !selectedMonth) {
      setSelectedMonth(monthsWithOrders[monthsWithOrders.length - 1]);
    }
  }, [monthsWithOrders, selectedMonth]);

  // Set default calendar year/month for calendar view
  useEffect(() => {
    const now = new Date();
    if (!calendarYear) setCalendarYear(now.getFullYear().toString());
    if (!calendarMonth) setCalendarMonth(String(now.getMonth() + 1).padStart(2, '0'));
  }, [calendarYear, calendarMonth]);

  // Filter by search and month/year
  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(filter.toLowerCase()) ||
      getSupplier(order.supplierId)?.name.toLowerCase().includes(filter.toLowerCase());
    const matchesYear = selectedYear
      ? new Date(order.createdAt).getFullYear().toString() === selectedYear
      : true;
    const matchesMonth = selectedMonth
      ? getMonthYear(order.createdAt) === selectedMonth
      : true;
    return matchesSearch && matchesYear && matchesMonth;
  });

  // Calendar navigation for filtering
  const handlePrevMonth = () => {
    const idx = monthsWithOrders.indexOf(selectedMonth);
    if (idx > 0) setSelectedMonth(monthsWithOrders[idx - 1]);
  };
  const handleNextMonth = () => {
    const idx = monthsWithOrders.indexOf(selectedMonth);
    if (idx < monthsWithOrders.length - 1) setSelectedMonth(monthsWithOrders[idx + 1]);
  };

  // Calendar grid for all months in selected year
  const monthsGrid = [
    '01','02','03','04','05','06','07','08','09','10','11','12'
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 font-['Poppins',_Arial,_sans-serif]">
      {/* Fixed SideMenu */}
      <aside className="w-60 h-screen bg-white shadow-lg fixed top-0 left-0 z-30">
        <SideMenu />
      </aside>
      {/* Main Content with left margin */}
      <div className="flex-1 ml-60 p-8">
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-tr from-gray-300 to-blue-200 rounded-full p-4 shadow-lg mr-4 border border-blue-400">
            <FiShoppingCart className="text-black text-5xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow">Purchase History</h1>
        </div>

        {/* Calendar View Feature */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FiCalendar className="text-2xl text-blue-600" />
            <span className="font-semibold text-lg">Calendar View:</span>
            <select
              className="px-2 py-1 rounded border border-blue-300"
              value={calendarYear}
              onChange={e => setCalendarYear(e.target.value)}
            >
              {Array.from({length: 11}, (_, i) => {
                const y = new Date().getFullYear() - 5 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            <select
              className="px-2 py-1 rounded border border-blue-300"
              value={calendarMonth}
              onChange={e => setCalendarMonth(e.target.value)}
            >
              {monthNames.map((name, idx) => (
                <option key={name} value={String(idx+1).padStart(2, '0')}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          {/* Calendar grid of months */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mb-4">
            {monthNames.map((name, idx) => {
              const m = String(idx + 1).padStart(2, '0');
              return (
                <button
                  key={m}
                  type="button"
                  className={`flex flex-col items-center justify-center px-0 py-4 rounded-lg border-2 font-semibold text-base shadow transition
                    ${calendarMonth === m
                      ? 'bg-blue-500 text-white border-blue-700 scale-105'
                      : 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer'
                    }
                  `}
                  onClick={() => setCalendarMonth(m)}
                >
                  <span className="text-lg font-bold">{name}</span>
                  <span className="text-xs">{calendarYear}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2 items-center">
            <span className="font-bold text-blue-700 text-lg">
              {monthNames[Number(calendarMonth)-1]} {calendarYear}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-end">
          <input
            type="text"
            placeholder="Search by PO ID or supplier..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition font-medium"
            style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-blue-500 text-lg font-semibold">Loading purchase orders...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-red-500 text-lg font-semibold">{error}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-2xl font-['Poppins',_Arial,_sans-serif]">
              <thead>
                <tr className="bg-blue-100 text-blue-900 font-bold uppercase text-sm">
                  <th className="px-6 py-3 text-left rounded-tl-xl">PO ID</th>
                  <th className="px-6 py-3 text-left">Date/Time</th>
                  <th className="px-6 py-3 text-left">Supplier</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Total Cost</th>
                  <th className="px-6 py-3 text-left">Payment</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400 font-mono">
                      No purchase orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const supplier = getSupplier(order.supplierId);
                    const totalOrderCost =
                      order.products.reduce((sum, p) => sum + p.total, 0) +
                      (order.tax || 0) -
                      (order.discount || 0);
                    return (
                      <tr
                        key={order.id}
                        className="border-t border-gray-200 hover:bg-blue-50 font-mono transition"
                      >
                        <td className="px-6 py-4 text-blue-700 font-bold">{order.id}</td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 text-gray-700">
                          <button
                            className="underline text-blue-600 hover:text-blue-800"
                            onClick={() => setShowDetails(order)}
                          >
                            {supplier?.name}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={
                              order.status === 'Completed'
                                ? 'text-green-600 font-semibold flex items-center'
                                : 'text-gray-600 font-semibold flex items-center'
                            }
                          >
                            {order.status === 'Completed' && <FiCheckCircle className="mr-1 text-black" />}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-blue-700 font-bold">₱{totalOrderCost.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-700">{order.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <button
                            className="px-3 py-1 bg-gradient-to-tr from-blue-500 to-blue-300 text-black rounded shadow hover:from-blue-600 hover:to-blue-400 font-semibold"
                            onClick={() => setShowDetails(order)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'rgba(0,0,0,0.25)',
              left: 0,
              width: '100vw',
            }}
          >
            <div className="bg-white bg-opacity-90 rounded-lg shadow-2xl p-8 max-w-3xl w-full mx-4 relative overflow-y-auto max-h-[95vh] font-['Poppins',_Arial,_sans-serif] flex flex-col items-center">
              <button
                onClick={() => setShowDetails(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center">
                <FiFileText className="mr-2 text-black" /> Purchase Order Details
              </h2>
              <div className="w-full mb-4">
                <div className="mb-2">
                  <span className="font-semibold">PO ID:</span> {showDetails.id}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Date/Time:</span> {formatDate(showDetails.createdAt)}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Supplier:</span> {getSupplier(showDetails.supplierId)?.name}
                  <div className="ml-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">Contact:</span> {getSupplier(showDetails.supplierId)?.contact}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {getSupplier(showDetails.supplierId)?.email}
                    </div>
                    <div>
                      <span className="font-semibold">Order History:</span>{' '}
                      {getSupplier(showDetails.supplierId)?.history.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Payment Method:</span> {showDetails.paymentMethod}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={
                      showDetails.status === 'Completed'
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-600 font-semibold'
                    }
                  >
                    {showDetails.status}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Approval Logs:</span>
                  <ul className="ml-6 list-disc text-sm">
                    {showDetails.approvalLogs.map((log, idx) => (
                      <li key={idx}>
                        {log.user} - {log.action} ({formatDate(log.timestamp)})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Purchase Notes:</span> {showDetails.notes || <span className="text-gray-400">None</span>}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Invoice:</span>{' '}
                  {showDetails.invoice ? (
                    <a
                      href={showDetails.invoice}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline flex items-center"
                    >
                      <FiDownload className="mr-1 text-black" /> Download Invoice
                    </a>
                  ) : (
                    <span className="text-gray-400">No invoice attached</span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Tax:</span> ₱{showDetails.tax?.toFixed(2) || '0.00'}
                  <span className="ml-6 font-semibold">Discount:</span> ₱{showDetails.discount?.toFixed(2) || '0.00'}
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow-inner border border-blue-200 my-4">
                  <span className="font-semibold text-lg text-blue-900">Total Order Cost:</span>{' '}
                  <span className="text-blue-700 font-extrabold text-2xl">
                    ₱
                    {(
                      showDetails.products.reduce((sum, p) => sum + p.total, 0) +
                      (showDetails.tax || 0) -
                      (showDetails.discount || 0)
                    ).toFixed(2)}
                  </span>
                  <div className="mt-4">
                    <span className="font-semibold">Discrepancies/Returns:</span>
                    {showDetails.returns.length === 0 &&
                    showDetails.products.every((p) => !p.discrepancy) ? (
                      <span className="ml-2 text-green-600">No issues</span>
                    ) : (
                      <ul className="ml-6 list-disc text-sm">
                        {showDetails.products
                          .filter((p) => p.discrepancy)
                          .map((p, idx) => (
                            <li key={idx} className="text-red-600">
                              {p.name}: {p.discrepancy}
                            </li>
                          ))}
                        {showDetails.returns.map((ret, idx) => (
                          <li key={idx} className="text-yellow-700">
                            {ret.product}: {ret.reason} ({ret.date})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4 w-full">
                <span className="font-semibold text-lg">Products:</span>
                <div className="overflow-x-auto mt-2">
                  <table className="w-full bg-gray-50 rounded shadow font-['Poppins',_Arial,_sans-serif] text-sm">
                    <thead>
                      <tr className="bg-gray-200 text-xs uppercase">
                        <th className="px-2 py-1 text-left">Image</th>
                        <th className="px-2 py-1 text-left">Name</th>
                        <th className="px-2 py-1 text-left">Category</th>
                        <th className="px-2 py-1 text-left">Variant</th>
                        <th className="px-2 py-1 text-left">Flavor</th>
                        <th className="px-2 py-1 text-left">Nicotine</th>
                        <th className="px-2 py-1 text-left">Qty Ordered</th>
                        <th className="px-2 py-1 text-left">Qty Received</th>
                        <th className="px-2 py-1 text-left">Cost/Item</th>
                        <th className="px-2 py-1 text-left">Total</th>
                        <th className="px-2 py-1 text-left">Discrepancy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showDetails.products.map((prod, idx) => (
                        <tr key={idx} className="border-t border-gray-200 hover:bg-blue-50">
                          <td className="px-2 py-1">
                            <img
                              src={prod.image || 'https://via.placeholder.com/40'}
                              alt={prod.name}
                              className="w-14 h-14 object-cover rounded shadow border border-gray-200"
                            />
                          </td>
                          <td className="px-2 py-1">{prod.name}</td>
                          <td className="px-2 py-1">{prod.category}</td>
                          <td className="px-2 py-1">{prod.variant}</td>
                          <td className="px-2 py-1">{prod.flavor || '-'}</td>
                          <td className="px-2 py-1">{prod.nicotine || '-'}</td>
                          <td className="px-2 py-1">{prod.quantityOrdered}</td>
                          <td className="px-2 py-1">{prod.quantityReceived}</td>
                          <td className="px-2 py-1">₱{prod.cost.toFixed(2)}</td>
                          <td className="px-2 py-1">₱{prod.total.toFixed(2)}</td>
                          <td className="px-2 py-1 text-red-600">{prod.discrepancy || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;