import React, { useState } from 'react';

// --- Mock Data for Suppliers and Orders ---
const initialSuppliers = [
  {
    id: 1,
    name: 'Vape Supplier Inc.',
    contact: 'John Doe',
    phone: '0917-123-4567',
    email: 'contact@vapesupplier.com',
    paymentTerms: 'Net 30',
    history: [1],
  },
  {
    id: 2,
    name: 'Juice World',
    contact: 'Jane Smith',
    phone: '0917-987-6543',
    email: 'orders@juiceworld.com',
    paymentTerms: 'Net 15',
    history: [2],
  },
];

const initialOrders = [
    {
      id: 1,
      poNumber: 'PO-20250424-001',
      supplierId: 1,
      items: [
        { name: 'Vape Pen', quantityOrdered: 50, quantityReceived: 0, barcode: 'VPEN001', condition: 'Good', stock: 10 },
        { name: 'Mint Juice', quantityOrdered: 30, quantityReceived: 0, barcode: 'MJUICE001', condition: 'Good', stock: 5 },
      ],
      status: 'Pending',
      date: '2025-04-24',
      verified: false,
      paymentStatus: 'Unpaid',
      receivingReport: [],
      notes: '',
      overdue: false,
      returns: [],
    },
    {
      id: 2,
      poNumber: 'PO-20250423-002',
      supplierId: 2,
      items: [
        { name: 'Strawberry Juice', quantityOrdered: 20, quantityReceived: 0, barcode: 'SJUICE001', condition: 'Good', stock: 2 },
      ],
      status: 'Pending',
      date: '2025-04-23',
      verified: false,
      paymentStatus: 'Unpaid',
      receivingReport: [],
      notes: '',
      overdue: true,
      returns: [],
    },
    {
      id: 3,
      poNumber: 'PO-20250422-003',
      supplierId: 1,
      items: [
        { name: 'Vape Battery', quantityOrdered: 15, quantityReceived: 0, barcode: 'VBATT001', condition: 'Good', stock: 3 },
        { name: 'Charger', quantityOrdered: 10, quantityReceived: 0, barcode: 'CHARGER001', condition: 'Good', stock: 1 },
      ],
      status: 'Pending',
      date: '2025-04-22',
      verified: false,
      paymentStatus: 'Unpaid',
      receivingReport: [],
      notes: '',
      overdue: false,
      returns: [],
    },
    {
      id: 4,
      poNumber: 'PO-20250421-004',
      supplierId: 2,
      items: [
        { name: 'Grape Juice', quantityOrdered: 25, quantityReceived: 0, barcode: 'GJUICE001', condition: 'Good', stock: 4 },
      ],
      status: 'Pending',
      date: '2025-04-21',
      verified: false,
      paymentStatus: 'Unpaid',
      receivingReport: [],
      notes: '',
      overdue: false,
      returns: [],
    },
    {
      id: 5,
      poNumber: 'PO-20250420-005',
      supplierId: 1,
      items: [
        { name: 'Vape Pod', quantityOrdered: 40, quantityReceived: 0, barcode: 'VPOD001', condition: 'Good', stock: 8 },
      ],
      status: 'Pending',
      date: '2025-04-20',
      verified: false,
      paymentStatus: 'Unpaid',
      receivingReport: [],
      notes: '',
      overdue: false,
      returns: [],
    },
    {
      id: 6,
      poNumber: 'PO-20250419-006',
      supplierId: 2,
      items: [
        { name: 'Blueberry Juice', quantityOrdered: 18, quantityReceived: 0, barcode: 'BJUICE001', condition: 'Good', stock: 2 },
      ],
      status: 'Pending',
      date: '2025-04-19',
      verified: false,
      paymentStatus: 'Unpaid',
      receivingReport: [],
      notes: '',
      overdue: false,
      returns: [],
    },
    {
      id: 7,
      poNumber: 'PO-20250418-007',
      supplierId: 1,
      items: [
        { name: 'Coil', quantityOrdered: 60, quantityReceived: 0, barcode: 'COIL001', condition: 'Good', stock: 12 },
      ],
      status: 'Pending',
      date: '2025-04-18',
      verified: false,
      paymentStatus: 'Unpaid',
      receivingReport: [],
      notes: '',
      overdue: false,
      returns: [],
    },
    {
      id: 8,
      poNumber: 'PO-20250417-008',
      supplierId: 2,
      items: [
        { name: 'Lemon Juice', quantityOrdered: 22, quantityReceived: 0, barcode: 'LJUICE001', condition: 'Good', stock: 3 },
      ],
      status: 'Pending',
      date: '2025-04-17',
      verified: false,
      paymentStatus: 'Unpaid',
      receivingReport: [],
      notes: '',
      overdue: false,
      returns: [],
    },
  ];

// --- Main Component ---
const PurchaseOrderReceiving = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [showSupplier, setShowSupplier] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [dashboardView, setDashboardView] = useState(true);
  const [reportFilter, setReportFilter] = useState({ date: '', supplier: '' });

  // --- Helper Functions ---
  const getSupplier = (supplierId) => suppliers.find(s => s.id === supplierId);

  // --- Purchase Order Tracking & Verification ---
  const handleReceive = (orderId, itemIdx, qty, condition = 'Good') => {
    setOrders(orders =>
      orders.map(order =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item, idx) =>
                idx === itemIdx
                  ? { ...item, quantityReceived: Math.min(qty, item.quantityOrdered), condition, stock: item.stock + (Math.min(qty, item.quantityOrdered) - item.quantityReceived) }
                  : item
              ),
              status: order.items.every((item, idx) =>
                idx === itemIdx
                  ? Math.min(qty, item.quantityOrdered) >= item.quantityOrdered
                  : item.quantityReceived >= item.quantityOrdered
              )
                ? 'Received'
                : 'Pending',
              verified: order.items.every((item, idx) =>
                idx === itemIdx
                  ? Math.min(qty, item.quantityOrdered) === item.quantityOrdered
                  : item.quantityReceived === item.quantityOrdered
              ),
              receivingReport: [
                ...order.receivingReport,
                {
                  date: new Date().toISOString().slice(0, 10),
                  item: order.items[itemIdx].name,
                  received: qty,
                  condition,
                },
              ],
            }
          : order
      )
    );
  };

  // --- Barcode Scanning ---
  const handleBarcodeScan = (barcode) => {
    if (!selectedOrder) return;
    const idx = selectedOrder.items.findIndex(item => item.barcode === barcode);
    if (idx === -1) {
      setAlerts(a => [...a, { type: 'error', msg: `Barcode ${barcode} not found in this order.` }]);
      return;
    }
    handleReceive(selectedOrder.id, idx, selectedOrder.items[idx].quantityOrdered);
    setAlerts(a => [...a, { type: 'success', msg: `Scanned and received: ${selectedOrder.items[idx].name}` }]);
  };

  // --- Payment Integration ---
  const handlePayment = (orderId) => {
    setOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, paymentStatus: 'Paid' } : order
      )
    );
    setAlerts(a => [...a, { type: 'success', msg: 'Payment marked as complete.' }]);
  };

  // --- Returns Management ---
  const handleReturn = (orderId, itemIdx, reason) => {
    setOrders(orders =>
      orders.map(order =>
        order.id === orderId
          ? {
              ...order,
              returns: [
                ...order.returns,
                {
                  item: order.items[itemIdx].name,
                  reason,
                  date: new Date().toISOString().slice(0, 10),
                },
              ],
            }
          : order
      )
    );
    setAlerts(a => [...a, { type: 'info', msg: 'Return recorded and supplier notified.' }]);
  };

  // --- Receiving Reports ---
  const generateReport = () => setShowReport(true);

  // --- Notifications & Alerts ---
  React.useEffect(() => {
    // Example: Alert for overdue orders
    orders.forEach(order => {
      if (order.overdue && !alerts.some(a => a.msg.includes(order.poNumber))) {
        setAlerts(a => [...a, { type: 'warning', msg: `Order ${order.poNumber} is overdue!` }]);
      }
    });
  }, [orders, alerts]);

  // --- AI-based Order Suggestions (Demo) ---
  const getOrderSuggestions = () => {
    // Suggest reorder if stock < 5
    return orders.flatMap(order =>
      order.items
        .filter(item => item.stock < 5)
        .map(item => ({
          item: item.name,
          suggestedQty: 50 - item.stock,
          reason: 'Low stock',
        }))
    );
  };

  // --- Loyalty Program (Demo) ---
  const loyaltyPoints = 120; // Example value

  // --- Inventory Forecasting (Demo) ---
  const forecastedSales = [
    { item: 'Vape Pen', forecast: 40 },
    { item: 'Mint Juice', forecast: 25 },
    { item: 'Strawberry Juice', forecast: 10 },
  ];

  // --- Dashboard Widgets ---
  const lowStockItems = orders.flatMap(order =>
    order.items.filter(item => item.stock < 5).map(item => ({
      ...item,
      orderId: order.id,
      poNumber: order.poNumber,
    }))
  );

  // --- UI ---
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      {/* Interactive Dashboard */}
      {dashboardView && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Inventory Dashboard</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="bg-yellow-100 p-4 rounded cursor-pointer hover:bg-yellow-200"
              onClick={() => setDashboardView(false)}
              title="View Low Stock Details"
            >
              <div className="font-bold text-lg">Low Stock Alert</div>
              <div>{lowStockItems.length} item(s) low in stock</div>
            </div>
            <div
              className="bg-blue-100 p-4 rounded cursor-pointer hover:bg-blue-200"
              onClick={generateReport}
              title="View Receiving Reports"
            >
              <div className="font-bold text-lg">Receiving Reports</div>
              <div>Click to view</div>
            </div>
            <div
              className="bg-green-100 p-4 rounded cursor-pointer hover:bg-green-200"
              onClick={() => alert('Loyalty Program: You have ' + loyaltyPoints + ' points!')}
              title="View Loyalty Program"
            >
              <div className="font-bold text-lg">Loyalty Program</div>
              <div>{loyaltyPoints} points</div>
            </div>
            <div
              className="bg-purple-100 p-4 rounded cursor-pointer hover:bg-purple-200"
              onClick={() => alert('Forecasted sales: ' + forecastedSales.map(f => `${f.item}: ${f.forecast}`).join(', '))}
              title="View Inventory Forecast"
            >
              <div className="font-bold text-lg">Inventory Forecast</div>
              <div>AI-based suggestions</div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Order Suggestions (AI-based)</h3>
            <ul className="list-disc ml-6">
              {getOrderSuggestions().length === 0 && <li>No suggestions at this time.</li>}
              {getOrderSuggestions().map((s, idx) => (
                <li key={idx}>
                  <span className="font-bold">{s.item}</span>: Suggest reorder {s.suggestedQty} units ({s.reason})
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setDashboardView(false)}
            >
              Go to Purchase Orders
            </button>
          </div>
        </div>
      )}

      {/* Alerts & Notifications */}
      {alerts.length > 0 && (
        <div className="mb-4 space-y-1">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-2 rounded text-sm ${
                alert.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : alert.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : alert.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {alert.msg}
            </div>
          ))}
        </div>
      )}

      {/* Supplier Management Modal */}
      {showSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">{showSupplier.name}</h3>
            <p><strong>Contact:</strong> {showSupplier.contact}</p>
            <p><strong>Phone:</strong> {showSupplier.phone}</p>
            <p><strong>Email:</strong> {showSupplier.email}</p>
            <p><strong>Payment Terms:</strong> {showSupplier.paymentTerms}</p>
            <h4 className="mt-4 font-semibold">Order History:</h4>
            <ul className="list-disc ml-6">
              {showSupplier.history.map(orderId => {
                const order = orders.find(o => o.id === orderId);
                return (
                  <li key={orderId}>
                    {order ? (
                      <button
                        className="text-blue-600 underline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowSupplier(null);
                          setDashboardView(false);
                        }}
                      >
                        {order.poNumber} ({order.date}) - {order.status}
                      </button>
                    ) : 'Order not found'}
                  </li>
                );
              })}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowSupplier(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Receiving Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Receiving Report</h3>
            <div className="mb-2">
              <label className="mr-2">Filter by Date:</label>
              <input
                type="date"
                value={reportFilter.date}
                onChange={e => setReportFilter(f => ({ ...f, date: e.target.value }))}
                className="border rounded px-2 py-1"
              />
              <label className="ml-4 mr-2">Supplier:</label>
              <select
                value={reportFilter.supplier}
                onChange={e => setReportFilter(f => ({ ...f, supplier: e.target.value }))}
                className="border rounded px-2 py-1"
              >
                <option value="">All</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            {orders
              .filter(order =>
                (!reportFilter.date || order.date === reportFilter.date) &&
                (!reportFilter.supplier || order.supplierId === Number(reportFilter.supplier))
              )
              .map(order => (
                <div key={order.id} className="mb-4">
                  <div className="font-semibold mb-1">{order.poNumber} - {getSupplier(order.supplierId)?.name}</div>
                  <ul className="list-disc ml-6">
                    {order.receivingReport.map((rep, idx) => (
                      <li key={idx}>
                        {rep.date}: {rep.item} - Received: {rep.received} ({rep.condition})
                      </li>
                    ))}
                  </ul>
                  {order.returns.length > 0 && (
                    <div className="mt-2 text-red-600">
                      Returns:
                      <ul className="list-disc ml-6">
                        {order.returns.map((ret, idx) => (
                          <li key={idx}>{ret.date}: {ret.item} - {ret.reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowReport(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Table/List */}
      {!dashboardView && !selectedOrder ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pending Orders</h3>
            <button
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              onClick={generateReport}
            >
              Receiving Reports
            </button>
          </div>
          <table className="w-full table-auto mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">PO Number</th>
                <th className="py-2 px-4 text-left">Supplier</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Payment</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t">
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDashboardView(false);
                      }}
                    >
                      {order.poNumber}
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => setShowSupplier(getSupplier(order.supplierId))}
                    >
                      {getSupplier(order.supplierId)?.name}
                    </button>
                  </td>
                  <td className="py-2 px-4">{order.date}</td>
                  <td className="py-2 px-4">
                    <span className={order.status === 'Received' ? 'text-green-600' : order.overdue ? 'text-yellow-600' : ''}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Receive
                    </button>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handlePayment(order.id)}
                      disabled={order.paymentStatus === 'Paid'}
                    >
                      Mark Paid
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mb-6">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={() => setDashboardView(true)}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : null}

      {/* Order Verification & Receiving */}
      {!dashboardView && selectedOrder && (
        <div>
          <button
            className="mb-4 text-blue-600 hover:underline"
            onClick={() => setSelectedOrder(null)}
          >
            &larr; Back to Orders
          </button>
          <h3 className="text-lg font-semibold mb-2">
            Order #{selectedOrder.poNumber} - {getSupplier(selectedOrder.supplierId)?.name}
          </h3>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Barcode Scan:</label>
            <input
              type="text"
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleBarcodeScan(barcodeInput);
                  setBarcodeInput('');
                }
              }}
              className="border rounded px-2 py-1 w-64"
              placeholder="Scan or enter barcode"
            />
          </div>
          <table className="w-full table-auto mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Item</th>
                <th className="py-2 px-4 text-left">Qty Ordered</th>
                <th className="py-2 px-4 text-left">Qty Received</th>
                <th className="py-2 px-4 text-left">Barcode</th>
                <th className="py-2 px-4 text-left">Condition</th>
                <th className="py-2 px-4 text-left">Receive</th>
                <th className="py-2 px-4 text-left">Return</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item, idx) => (
                <tr key={item.name} className="border-t">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.quantityOrdered}</td>
                  <td className="py-2 px-4">{item.quantityReceived}</td>
                  <td className="py-2 px-4">{item.barcode}</td>
                  <td className="py-2 px-4">
                    <select
                      value={item.condition}
                      onChange={e =>
                        handleReceive(
                          selectedOrder.id,
                          idx,
                          item.quantityReceived,
                          e.target.value
                        )
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="Good">Good</option>
                      <option value="Damaged">Damaged</option>
                      <option value="Defective">Defective</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min={0}
                      max={item.quantityOrdered}
                      value={item.quantityReceived}
                      onChange={e =>
                        handleReceive(
                          selectedOrder.id,
                          idx,
                          Math.max(0, Math.min(item.quantityOrdered, Number(e.target.value))),
                          item.condition
                        )
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => {
                        const reason = prompt('Reason for return:');
                        if (reason) handleReturn(selectedOrder.id, idx, reason);
                      }}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <span className="font-semibold">
              Status:{' '}
              <span className={selectedOrder.status === 'Received' ? 'text-green-600' : 'text-yellow-600'}>
                {selectedOrder.status}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderReceiving;