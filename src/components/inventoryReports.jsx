import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import { 
  FaBoxes, 
  FaExclamationTriangle, 
  FaChartLine, 
  FaExchangeAlt, 
  FaCalendarTimes, 
  FaMoneyBillWave, 
  FaTruck, 
  FaHistory, 
  FaBoxOpen, 
  FaDollarSign,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaPlusCircle,
  FaWarehouse,
  FaChartBar,
  FaClipboardList
} from 'react-icons/fa';

// Mock data for demonstration
const mockItems = [
  { id: 1, name: 'Vape Pen', stock: 50, image: '/img/Vape pen.jpg', category: 'Device', variant: 'Standard', flavor: '', nicotine: '', price: 500, cost: 300, supplier: 'Vape Supplier Inc.', expiry: '2025-12-31', sales: 120, returns: 2, damaged: 1 },
  { id: 2, name: 'Nicotine Salt', stock: 5, image: '/img/Nicotine Salt.jpg', category: 'Liquid', variant: '30ml', flavor: 'Mint', nicotine: '35mg', price: 250, cost: 120, supplier: 'Juice World', expiry: '2024-08-01', sales: 80, returns: 1, damaged: 0 },
  { id: 3, name: 'Vape Coil', stock: 15, image: '/img/Vape Coil.jpg', category: 'Accessory', variant: 'Mesh', flavor: '', nicotine: '', price: 100, cost: 50, supplier: 'Vape Supplier Inc.', expiry: '', sales: 60, returns: 0, damaged: 2 },
  { id: 4, name: 'Vape Tank', stock: 20, image: '/img/Vape Tanks.jpg', category: 'Accessory', variant: 'Glass', flavor: '', nicotine: '', price: 200, cost: 120, supplier: 'Vape Supplier Inc.', expiry: '', sales: 40, returns: 0, damaged: 0 },
  { id: 5, name: 'Disposable Vape', stock: 8, image: '/img/Disposable Vape.jpg', category: 'Device', variant: 'Disposable', flavor: 'Strawberry', nicotine: '20mg', price: 350, cost: 200, supplier: 'Juice World', expiry: '2025-03-15', sales: 100, returns: 3, damaged: 1 },
  { id: 6, name: 'E-Liquid 50ml', stock: 30, image: '/img/E Liquid.jpg', category: 'Liquid', variant: '50ml', flavor: 'Grape', nicotine: '0mg', price: 180, cost: 90, supplier: 'Juice World', expiry: '2025-06-30', sales: 55, returns: 0, damaged: 0 },
];

const mockSuppliers = [
  { name: 'Vape Supplier Inc.', deliveries: 12, onTime: 11, late: 1, qualityIssues: 1 },
  { name: 'Juice World', deliveries: 10, onTime: 8, late: 2, qualityIssues: 2 },
];

const mockMovements = [
  { date: '2025-04-20', type: 'IN', item: 'Vape Pen', qty: 20, note: 'Purchase Order' },
  { date: '2025-04-21', type: 'OUT', item: 'Vape Pen', qty: 5, note: 'Sale' },
  { date: '2025-04-22', type: 'OUT', item: 'Disposable Vape', qty: 2, note: 'Return' },
  { date: '2025-04-23', type: 'IN', item: 'E-Liquid 50ml', qty: 10, note: 'Purchase Order' },
];

const InventoryReports = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStock, setFilterStock] = useState('all');
  const [showMovements, setShowMovements] = useState(false);
  const [showSupplierPerf, setShowSupplierPerf] = useState(false);

  // Restock modal state
  const [restockModal, setRestockModal] = useState({ open: false, item: null, qty: 1, source: 'Purchase Order' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    setItems(mockItems);
    setIsLoading(false);
  }, []);

  // Stock Overview
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);

  // Low Stock Alerts
  const lowStockItems = items.filter((item) => item.stock < 10);

  // Expired Stock Report
  const today = new Date().toISOString().slice(0, 10);
  const expiredItems = items.filter(item => item.expiry && item.expiry < today);

  // Profitability Analysis
  const profitability = items.map(item => ({
    ...item,
    profit: (item.price - item.cost) * item.sales,
    margin: item.price && item.cost ? (((item.price - item.cost) / item.price) * 100).toFixed(1) : 'N/A',
  }));

  // Damaged & Returned Items
  const damagedReturned = items.filter(item => item.damaged > 0 || item.returns > 0);

  // Cost Analysis
  const totalCost = items.reduce((sum, item) => sum + (item.cost * item.stock), 0);

  // Sorting and Filtering
  const handleSort = () => {
    const sortedItems = [...items].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.stock - b.stock;
      } else {
        return b.stock - a.stock;
      }
    });
    setItems(sortedItems);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Open restock modal with choices
  const handleRestock = (id) => {
    const item = items.find((i) => i.id === id);
    setRestockModal({ open: true, item, qty: 1, source: 'Purchase Order' });
  };

  // Confirm restock with selected quantity and source
  const handleRestockConfirm = () => {
    const { item, qty } = restockModal;
    if (!item || qty < 1) {
      setRestockModal({ open: false, item: null, qty: 1, source: 'Purchase Order' });
      return;
    }
    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, stock: i.stock + Number(qty) } : i
    );
    setItems(updatedItems);
    setRestockModal({ open: false, item: null, qty: 1, source: 'Purchase Order' });
  };

  const filteredItems =
    filterStock === 'low'
      ? items.filter((item) => item.stock < 10)
      : filterStock === 'high'
      ? items.filter((item) => item.stock >= 10)
      : items;

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sales by Product
  const topSales = [...items].sort((a, b) => b.sales - a.sales);

  // Historical Inventory Trends (mocked)
  const trends = [
    { month: 'Jan', stock: 120 },
    { month: 'Feb', stock: 110 },
    { month: 'Mar', stock: 130 },
    { month: 'Apr', stock: 128 },
  ];

  // Reset to page 1 if filter changes and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filterStock, totalPages, currentPage]);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Icons in Background */}
      <FaBoxes className="absolute -left-10 top-1/4 text-blue-100 text-6xl opacity-20 transform rotate-12" />
      <FaWarehouse className="absolute right-20 bottom-1/3 text-blue-100 text-8xl opacity-15" />
      <FaChartBar className="absolute left-1/3 top-1/2 text-blue-100 text-7xl opacity-20 transform -rotate-15" />
      <FaClipboardList className="absolute right-40 top-20 text-blue-100 text-9xl opacity-10" />
      
      {/* Fixed SideMenu */}
      <aside className="w-60 h-screen bg-gray-800 text-white fixed top-0 left-0 z-30 overflow-y-auto">
        <SideMenu />
      </aside>
      
      {/* Main Content with left margin */}
      <div className="flex-1 ml-60 p-6 relative z-10">
        <div className="max-w-7xl mx-auto rounded-lg shadow-lg p-6 bg-white/70 backdrop-blur-md">
          <div className="flex items-center mb-6 justify-between">
            <div className="flex items-center">
              <FaBoxes className="text-3xl text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Inventory Reports</h1>
            </div>
            {/* Restock Item Button */}
            <button
              className="flex items-center px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow"
              onClick={() => {
                if (items.length > 0) setRestockModal({ open: true, item: items[0], qty: 1, source: 'Purchase Order' });
              }}
            >
              <FaPlusCircle className="mr-2" /> Restock Item
            </button>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading inventory...</p>
          ) : (
            <div>
              {/* ...other report sections... */}
              {/* Full Inventory Table with Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaBoxes className="text-xl text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Full Inventory</h2>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilterStock('all')}
                      className={`px-3 py-1 rounded-md text-sm ${filterStock === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterStock('low')}
                      className={`px-3 py-1 rounded-md text-sm ${filterStock === 'low' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    >
                      Low Stock
                    </button>
                    <button
                      onClick={() => setFilterStock('high')}
                      className={`px-3 py-1 rounded-md text-sm ${filterStock === 'high' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                      High Stock
                    </button>
                  </div>
                </div>
                <table className="w-full bg-gray-50 rounded-lg shadow-md border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-left border-b border-gray-200">
                      <th className="px-3 py-3">Image</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Variant</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Supplier</th>
                      <th className="px-4 py-3">Expiry</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-4 py-3">{item.id}</td>
                        <td className="px-4 py-3 whitespace-normal break-words text-gray-800 font-medium">
                          {item.name}
                        </td>
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3">{item.variant}</td>
                        <td
                          className={`px-4 py-3 font-semibold ${
                            item.stock < 1 ? 'text-red-500' : item.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                          }`}
                        >
                          {item.stock}
                        </td>
                        <td className="px-4 py-3">{item.supplier}</td>
                        <td className="px-4 py-3">{item.expiry || '-'}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleRestock(item.id)}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <FaPlusCircle className="mr-2" /> Restock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
                {/* Restock Modal */}
                {restockModal.open && (
                  <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ background: 'rgba(0,0,0,0.25)' }}
                  >
                    <div className="bg-white bg-opacity-90 rounded-lg shadow-2xl p-8 max-w-lg w-full relative backdrop-blur-md">
                      <h2 className="text-xl font-bold mb-4 text-blue-800">Restock Item</h2>
                      <div className="mb-4">
                        <div className="font-semibold mb-2">{restockModal.item.name}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="font-medium" htmlFor="restock-qty">Quantity (Items):</label>
                          <input
                            id="restock-qty"
                            type="number"
                            min={1}
                            value={restockModal.qty}
                            onChange={e => setRestockModal({ ...restockModal, qty: e.target.value })}
                            className="border rounded px-2 py-1 w-24 bg-white/80"
                          />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="font-medium">Restock Source:</label>
                          <select
                            className="border rounded px-2 py-1 bg-white/80"
                            value={restockModal.source}
                            onChange={e => setRestockModal({ ...restockModal, source: e.target.value })}
                          >
                            <option>Purchase Order</option>
                            <option>Supplier Return</option>
                            <option>Manual Adjustment</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => setRestockModal({ open: false, item: null, qty: 1, source: 'Purchase Order' })}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={handleRestockConfirm}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;