import React, { useState, useEffect } from 'react';
import SideMenu from '../layouts/SideMenu';
import API from '../api';
import { FiX, FiArrowUp, FiArrowDown, FiPrinter } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          Component error - Please check the console
        </div>
      );
    }
    return this.props.children;
  }
}

const sampleUsers = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'cashier1', role: 'cashier' }
];

const paymentMethods = [
  { key: 'cash', label: 'Cash' },
  { key: 'card', label: 'Card' }
];

const POS = () => {
  const [currentUser, setCurrentUser] = useState(sampleUsers[0]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [receiptItems, setReceiptItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        const validatedProducts = response.data.map(prod => ({
          ...prod,
          price: Number(prod.price) || 0,
          stock: Number(prod.stock) || 0
        }));
        setProducts(validatedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorAlert('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const userRole = {
    admin: { canRefund: true, canEditProduct: true },
    cashier: { canRefund: false, canEditProduct: false }
  }[currentUser.role];

  const logActivity = (desc) => {
    setActivityLogs(logs => [
      ...logs,
      { 
        user: currentUser.username, 
        desc,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

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
    
    const newItem = {
      ...prod,
      quantity,
      price: Number(prod.price)
    };

    setCart(prevCart => existing
      ? prevCart.map(item => 
          item.id === prod.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      : [...prevCart, newItem]
    );

    logActivity(`Added ${quantity} x ${prod.name}`);
    setQuantity(1);
    setSelectedProduct('');
  };

  const handleRemove = (id) => {
    setCart(cart.filter(item => item.id !== id));
    logActivity(`Removed product ID ${id}`);
  };

  const handleCompleteTransaction = async () => {
    if (cart.length === 0) {
      setErrorAlert('Cart is empty.');
      return;
    }

    try {
      setReceiptItems([...cart]);
      
      // Update stock in the backend
      await Promise.all(cart.map(async (item) => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          // Structure the update payload explicitly
          const updatePayload = {
            name: product.name,
            price: product.price,
            stock: product.stock - item.quantity,
            // Include any other required fields from your API
            category_id: product.category_id,
            unit: product.unit
          };
          
          console.log('Sending update payload:', updatePayload); // Debug log
          
          const response = await API.put(`/products/${item.id}`, updatePayload);
          console.log('Update response:', response.data); // Debug log
        }
      }));

      // Refresh products after update
      const response = await API.get('/products');
      const validatedProducts = response.data.map(prod => ({
        ...prod,
        price: Number(prod.price),
        stock: Number(prod.stock)
      }));
      setProducts(validatedProducts);
      
     
      logActivity('Transaction complete');
      setShowReceipt(true);
      setErrorAlert('');
    } catch (error) {
      console.error('Error completing transaction:', error);
      console.error('Error details:', error.response?.data); // Detailed error log
      
      // Handle validation errors
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors || {};
        const errorMessages = Object.values(serverErrors).flat().join(', ');
        setErrorAlert(errorMessages || 'Validation failed');
      } else {
        setErrorAlert(error.response?.data?.message || 'Failed to complete transaction');
      }
    }
  };

  const getTotal = () => cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const handleCashGiven = (val) => {
    setCashGiven(val);
    const total = getTotal();
    const given = parseFloat(val) || 0;
    setChange(given - total > 0 ? (given - total) : 0);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrintReceipt = () => {
    // This would be where you implement actual printing functionality
    // For now, we'll just log it
    console.log('Printing receipt...', receiptItems);
    // You could also use window.print() for a basic print dialog
  };

  const closeReceiptModal = () => {
    setShowReceipt(false);
    setCart([]);
    setCashGiven('');
    setChange(0);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SideMenu />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-100">
        <SideMenu />
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">POS</h1>
                
              </div>
              <select
                value={currentUser.id}
                onChange={e => setCurrentUser(sampleUsers.find(u => u.id === Number(e.target.value)))}
                className="border rounded-lg px-4 py-2 w-48 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sampleUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>

            {/* Product Search and Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-8">
                  <input
                    type="text"
                    placeholder="🔍 Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-3 bg-gray-50 border-r hover:bg-gray-100"
                    >
                      <FiArrowDown className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 text-center focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-3 bg-gray-50 border-l hover:bg-gray-100"
                    >
                      <FiArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    disabled={!selectedProduct}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-5 gap-4 h-96 overflow-y-auto p-2">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      selectedProduct === product.id 
                        ? 'border-blue-500 bg-blue-50 scale-[98%]' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {/* Product Image */}
                    <img
                      src={product.image ? `http://localhost:8000/storage/${product.image}` : '/placeholder.jpg'}
                      alt={product.name}
                      className="w-40 h-40 object-cover rounded mb-2 mx-auto"
                    />

                    {/* Product Name */}
                    <h3 className="font-medium truncate text-center">{product.name}</h3>

                    {/* Price and Stock Info */}
                    <div className="mt-2 text-sm text-center">
                      <div className="text-blue-600">
                        ₱{Number(product.price).toFixed(2)}
                      </div>
                      <div className="text-gray-500">Stock: {product.stock}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Current Order</h2>
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold text-blue-600">
                    ₱{getTotal().toFixed(2)}
                  </div>
                  <div className="flex gap-2">
                    {paymentMethods.map(method => (
                      <button
                        key={method.key}
                        onClick={() => setSelectedPayment(method.key)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedPayment === method.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-center">Price</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-center">Total</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id} className="border-t hover:bg-gray-50 group">
                        <td className="p-3 max-w-[200px] truncate">{item.name}</td>
                        <td className="p-3 text-center">
                          ₱{Number(item.price).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-center font-medium">
                          ₱{(Number(item.price) * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {cart.length === 0 && (
                  <div className="p-6 text-center text-gray-400">
                    No items in cart. Select products above to begin.
                  </div>
                )}
              </div>
            </div>

            {/* Payment Section */}
            {selectedPayment === 'cash' && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-2 gap-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cash Received</label>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={e => handleCashGiven(e.target.value)}
                      className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Change Due</label>
                    <div className="w-full px-4 py-3 bg-gray-100 rounded-xl font-bold text-blue-600">
                      ₱{change.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Button */}
            <button
              onClick={handleCompleteTransaction}
              disabled={cart.length === 0 || (selectedPayment === 'cash' && change < 0)}
              className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Complete Transaction
            </button>
          </div>

          {/* Activity Logs Sidebar */}
          <div className="w-96 bg-white border-l p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
            <div className="space-y-3 h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              {activityLogs.slice().reverse().map((log, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-blue-600">{log.user}</span>
                    <span className="text-gray-500">{log.time}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">{log.desc}</div>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  No activities to display
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-xl font-semibold">Transaction Receipt</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={handlePrintReceipt}
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title="Print Receipt"
                  >
                    <FiPrinter className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={closeReceiptModal}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title="Close"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-4 text-center">
                  <h3 className="font-bold text-lg">Vape Shop</h3>
                  <p className="text-sm text-gray-500">Tagoloan</p>
                  <p className="text-sm text-gray-500">Phone: (123) 456-7890</p>
                </div>
                
                <div className="border-t border-b py-2 my-3 text-sm">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cashier:</span>
                    <span>{currentUser.username}</span>
                  </div>
                </div>
                
                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Item</th>
                      <th className="text-right pb-2">Price</th>
                      <th className="text-right pb-2">Qty</th>
                      <th className="text-right pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptItems.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="text-right py-2">₱{item.price.toFixed(2)}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">₱{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t pt-3 text-sm">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal:</span>
                    <span>₱{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{selectedPayment === 'cash' ? 'Cash' : 'Credit Card'}</span>
                  </div>
                  {selectedPayment === 'cash' && (
                    <>
                      <div className="flex justify-between">
                        <span>Cash Received:</span>
                        <span>₱{parseFloat(cashGiven || '0').toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Change:</span>
                        <span>₱{change.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500">
                  <p>Thank you for your purchase!</p>
                  <p>Please come again</p>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="border-t p-4 flex justify-end">
                <button
                  onClick={closeReceiptModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default POS;