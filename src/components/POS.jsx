import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';

// --- Mock Data and Roles ---
const sampleProducts = [
  { id: 1, name: "Vape Pen", price: 649.50, stock: 10 },
  { id: 2, name: "Nicotine Juice", price: 274.50, stock: 15 },
  { id: 3, name: "Vape Battery", price: 649.50, stock: 7 },
  { id: 4, name: "Vape Pod", price: 499.50, stock: 5 },
];

const sampleUsers = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'cashier1', role: 'cashier' },
];

const roles = {
  admin: { canRefund: true, canEditProduct: true },
  cashier: { canRefund: false, canEditProduct: false }
};

const paymentMethods = [
  { key: 'cash', label: 'Cash' },
  { key: 'card', label: 'Card' }
];

const POS = () => {
  const [currentUser, setCurrentUser] = useState(sampleUsers[1]);
  const [products, setProducts] = useState(sampleProducts);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activityLogs, setActivityLogs] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [cashGiven, setCashGiven] = useState('');
  const [change, setChange] = useState(0);
  const [notification, setNotification] = useState('');
  const [errorAlert, setErrorAlert] = useState('');

  const userRole = roles[currentUser.role];

  const logActivity = (desc) => {
    setActivityLogs(logs => [
      ...logs,
      { user: currentUser.username, desc, time: new Date().toLocaleTimeString() }
    ]);
  };

  // Low Stock Warning
  useEffect(() => {
    if (cart.length > 0 && userRole.canEditProduct) {
      const lowStock = cart.filter(item => {
        const prod = products.find(p => p.id === item.id);
        return prod && prod.stock - item.quantity < 3;
      });
      setNotification(lowStock.length > 0 ? `Low stock: ${lowStock.map(i => i.name).join(', ')}` : '');
    } else {
      setNotification('');
    }
  }, [cart, products, userRole]);

  const handleAddToCart = () => {
    const prod = products.find(p => p.id === Number(selectedProduct));
    if (!prod) { setErrorAlert('Select a product.'); return; }
    if (quantity < 1 || quantity > prod.stock) { setErrorAlert('Invalid quantity.'); return; }
    setErrorAlert('');
    const existing = cart.find(item => item.id === prod.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === prod.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { ...prod, quantity }]);
    }
    logActivity(`Added ${quantity} x ${prod.name}`);
    setQuantity(1);
    setSelectedProduct('');
  };

  const handleRemove = (id) => {
    setCart(cart.filter(item => item.id !== id));
    logActivity(`Removed product ID ${id}`);
  };

  const handleCompleteTransaction = () => {
    if (cart.length === 0) { setErrorAlert('Cart is empty.'); return; }
    setProducts(products =>
      products.map(prod => {
        const cartItem = cart.find(item => item.id === prod.id);
        if (cartItem) {
          return { ...prod, stock: prod.stock - cartItem.quantity };
        }
        return prod;
      })
    );
    logActivity('Transaction complete');
    setShowReceipt(true);
    setCart([]);
    setCashGiven('');
    setChange(0);
    setErrorAlert('');
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCashGiven = (val) => {
    setCashGiven(val);
    const total = getTotal();
    const given = parseFloat(val) || 0;
    setChange(given - total > 0 ? (given - total) : 0);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu />
      <div className="flex-1 flex flex-row">
        {/* Main POS */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="p-4 w-full max-w-xl">
            {/* Alerts */}
            {notification && (
              <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded">{notification}</div>
            )}
            {errorAlert && (
              <div className="mb-2 p-2 bg-red-100 text-red-800 rounded">{errorAlert}</div>
            )}

            {/* User & Payment */}
            <div className="flex justify-between items-center mb-4">
              <select
                value={currentUser.id}
                onChange={e => setCurrentUser(sampleUsers.find(u => u.id === Number(e.target.value)))}
                className="border rounded px-2 py-1"
              >
                {sampleUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
              <select
                value={selectedPayment}
                onChange={e => setSelectedPayment(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {paymentMethods.map(m => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Product Picker */}
            <div className="flex gap-2 mb-4">
              <select
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₱{p.price} | Stock: {p.stock})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                max={selectedProduct ? products.find(p => p.id === Number(selectedProduct)).stock : 1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
                placeholder="Qty"
              />
              <button
                onClick={handleAddToCart}
                className="bg-blue-500 text-white px-3 py-1 rounded"
                disabled={!selectedProduct}
              >
                Add
              </button>
            </div>

                {/* Cart */}
            <div className="bg-white rounded shadow p-4 mb-4">
              <h2 className="font-semibold mb-2">Cart</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">No items in cart.</p>
              ) : (
                <table className="w-full text-sm mb-2">
                  <thead>
                    <tr>
                      <th className="text-center">Product</th>
                      <th className="text-center">Qty</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Subtotal</th>
                      <th className="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td className="text-center">{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">₱{item.price}</td>
                        <td className="text-center">₱{(item.price * item.quantity).toFixed(2)}</td>
                        <td className="text-center">
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="flex justify-between mt-2 font-bold">
                <span>Total:</span>
                <span>₱{getTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Payment */}
            {selectedPayment === 'cash' && (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Cash Given"
                  value={cashGiven}
                  onChange={e => handleCashGiven(e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                />
                <span>Change: <span className="font-bold">₱{change.toFixed(2)}</span></span>
              </div>
            )}
            <button
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-2"
              disabled={cart.length === 0}
              onClick={handleCompleteTransaction}
            >
              Complete Transaction
            </button>

            {/* Receipt */}
            {showReceipt && (
              <div className="bg-white rounded shadow p-4 mt-4">
                <h2 className="font-semibold mb-2">Receipt</h2>
                <div className="mb-2 font-bold">VapeSHOP</div>
                <div className="mb-2 text-xs">Cashier: {currentUser.username}</div>
                <table className="w-full text-xs mb-2">
                  <thead>
                    <tr>
                      <th className="text-center">Product</th>
                      <th className="text-center">Qty</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td className="text-center">{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">₱{item.price}</td>
                        <td className="text-center">₱{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₱{getTotal().toFixed(2)}</span>
                </div>
                <button
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  onClick={() => setShowReceipt(false)}
                >
                  Close Receipt
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Activity Logs - scrollable and simple */}
        <div className="w-80 h-screen overflow-y-auto bg-white shadow-lg p-4 border-l border-gray-200 flex flex-col">
          <h2 className="font-semibold mb-2">Activity Logs</h2>
          <div className="flex-1 text-xs space-y-1">
            {activityLogs.length === 0 ? (
              <div className="text-gray-400">No activity yet.</div>
            ) : (
              activityLogs.slice().reverse().map((log, idx) => (
                <div key={idx} className="mb-1 border-b pb-1">
                  <span className="text-gray-500">[{log.time}]</span> <span className="font-bold">{log.user}</span>: {log.desc}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;