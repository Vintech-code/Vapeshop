import React, { useState, useEffect, useRef } from 'react';
import {
  FiShoppingCart, FiTag, FiStar, FiTrendingUp, FiChevronDown, FiChevronUp, FiEdit, FiEye, FiHeart, FiSearch, FiMessageCircle, FiPrinter, FiMail
} from 'react-icons/fi';
import SideMenu from '../layouts/SideMenu';

// --- Mock Data (add more as needed) ---
const mockCategories = [
  {
    id: 1,
    name: 'Vape Devices',
    description: 'All types of vape devices',
    image: '/img/Vape Devices1.webp',
    productCount: 10,
    tags: ['Best Seller'],
    popularity: 5,
    salesVolume: 120,
    subcategories: [
      { name: 'Vape Mods', icon: <FiStar className="inline text-yellow-500" /> },
      { name: 'Pod Systems', icon: <FiStar className="inline text-yellow-500" /> },
    ],
    settings: { taxRate: 12, discount: 0 },
  },
  {
    id: 2,
    name: 'E-Liquids',
    description: 'Flavored e-liquids and nicotine salts',
    image: '/img/Vape E liquids.jpg',
    productCount: 25,
    tags: ['New Arrival'],
    popularity: 4,
    salesVolume: 95,
    subcategories: [
      { name: 'Nicotine Salt', icon: <FiTag className="inline text-blue-500" /> },
      { name: 'Freebase', icon: <FiTag className="inline text-blue-500" /> },
      { name: 'Flavored', icon: <FiTag className="inline text-blue-500" /> },
    ],
    settings: { taxRate: 10, discount: 5 },
  },
  {
    id: 3,
    name: 'Accessories',
    description: 'Coils, tanks, and other accessories',
    image: '/img/Vape accessories.jpg',
    productCount: 15,
    tags: [],
    popularity: 3,
    salesVolume: 60,
    subcategories: [
      { name: 'Coils', icon: <FiTag className="inline text-green-500" /> },
      { name: 'Vape Tanks', icon: <FiTag className="inline text-green-500" /> },
      { name: 'Chargers', icon: <FiTag className="inline text-green-500" /> },
    ],
    settings: { taxRate: 8, discount: 0 },
  },
  {
    id: 4,
    name: 'Disposable Vapes',
    description: 'Single-use disposable vapes',
    image: '/img/Vape Disposable.avif',
    productCount: 8,
    tags: ['Best Seller'],
    popularity: 5,
    salesVolume: 150,
    subcategories: [],
    settings: { taxRate: 12, discount: 2 },
  },
];

const mockProducts = [
  {
    id: 1,
    name: 'Vape Pen',
    price: 25.99,
    category: 'Vape Devices',
    stock: 20,
    brand: 'VapeX',
    image: '/img/vape pen2.jpg',
    attributes: { color: 'Black', size: 'Standard' },
    tags: ['Best Seller'],
    description: 'A reliable vape pen for everyday use.',
    flavors: [],
    nicotine: '',
    reviews: [
      { user: 'Mark', rating: 5, comment: 'Great device!' },
      { user: 'Anna', rating: 4, comment: 'Smooth draw.' },
    ],
  },
  {
    id: 2,
    name: 'Vape Mod',
    price: 45.99,
    category: 'Vape Devices',
    stock: 10,
    brand: 'CloudMaster',
    image: '/img/Vape Mod.jpg',
    attributes: { color: 'Silver', size: 'Large' },
    tags: [],
    description: 'Powerful mod for advanced users.',
    flavors: [],
    nicotine: '',
    reviews: [],
  },
  {
    id: 3,
    name: 'E-Liquid Strawberry',
    price: 18.99,
    category: 'E-Liquids',
    stock: 50,
    brand: 'JuiceWorld',
    image: '/img/E Liquid.jpg',
    attributes: { flavor: 'Strawberry', nicotine: '3mg', size: '60ml' },
    tags: ['New Arrival'],
    description: 'Sweet strawberry flavor, smooth throat hit.',
    flavors: ['Strawberry'],
    nicotine: '3mg',
    reviews: [
      { user: 'Joy', rating: 5, comment: 'Love the flavor!' },
    ],
  },
  {
    id: 4,
    name: 'E-Liquid Mint',
    price: 18.99,
    category: 'E-Liquids',
    stock: 2,
    brand: 'JuiceWorld',
    image: '/img/E Liquid.jpg',
    attributes: { flavor: 'Mint', nicotine: '6mg', size: '60ml' },
    tags: [],
    description: 'Refreshing mint for a cool vape.',
    flavors: ['Mint'],
    nicotine: '6mg',
    reviews: [],
  },
  {
    id: 5,
    name: 'Vape Coil',
    price: 10.49,
    category: 'Accessories',
    stock: 100,
    brand: 'CoilPro',
    image: '/img/Vape Coil.jpg',
    attributes: { type: 'Mesh', resistance: '0.2Ω' },
    tags: [],
    description: 'Durable mesh coil for better flavor.',
    flavors: [],
    nicotine: '',
    reviews: [],
  },
  {
    id: 6,
    name: 'Vape Tank',
    price: 35.99,
    category: 'Accessories',
    stock: 15,
    brand: 'TankMaster',
    image: '/img/Vape Tanks.jpg',
    attributes: { color: 'Clear', size: 'Large' },
    tags: [],
    description: 'Large capacity tank for longer vaping.',
    flavors: [],
    nicotine: '',
    reviews: [],
  },
  {
    id: 7,
    name: 'Disposable Vape',
    price: 12.99,
    category: 'Disposable Vapes',
    stock: 1,
    brand: 'PuffBar',
    image: '/img/Disposable Vape.jpg',
    attributes: { flavor: 'Grape', nicotine: '5%' },
    tags: ['Best Seller'],
    description: 'Convenient disposable vape, grape flavor.',
    flavors: ['Grape'],
    nicotine: '5%',
    reviews: [
      { user: 'Sam', rating: 4, comment: 'Handy for travel.' },
    ],
  },
  {
    id: 8,
    name: 'E-Liquid Mango',
    price: 19.99,
    category: 'E-Liquids',
    stock: 12,
    brand: 'JuiceWorld',
    image: '/img/E Liquid.jpg',
    attributes: { flavor: 'Mango', nicotine: '3mg', size: '60ml' },
    tags: [],
    description: 'Juicy mango flavor for tropical vibes.',
    flavors: ['Mango'],
    nicotine: '3mg',
    reviews: [],
  },
  {
    id: 9,
    name: 'Pod System',
    price: 29.99,
    category: 'Vape Devices',
    stock: 8,
    brand: 'PodKing',
    image: '/img/Pod System.webp',
    attributes: { color: 'Blue', size: 'Compact' },
    tags: ['New Arrival'],
    description: 'Portable pod system for on-the-go vaping.',
    flavors: [],
    nicotine: '',
    reviews: [],
  },
  {
    id: 10,
    name: 'Charger USB',
    price: 8.99,
    category: 'Accessories',
    stock: 30,
    brand: 'ChargePro',
    image: '/img/Charger USB.avif',
    attributes: { type: 'USB', compatibility: 'Universal' },
    tags: [],
    description: 'Universal USB charger for vape devices.',
    flavors: [],
    nicotine: '',
    reviews: [],
  },
];

const sortOptions = [
  { label: 'Alphabetical (A-Z)', value: 'alpha' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Sales Volume', value: 'sales' },
  { label: 'Most Popular', value: 'mostPopular' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'priceLow' },
  { label: 'Price: High to Low', value: 'priceHigh' },
];

const brands = ['VapeX', 'CloudMaster', 'JuiceWorld', 'CoilPro', 'TankMaster', 'PuffBar', 'PodKing', 'ChargePro'];

const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Mobile Payment', value: 'mobile' },
];

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('alpha');
  const [showSubcategories, setShowSubcategories] = useState({});
  const [productSearch, setProductSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // Cart panel state (shows after Shop Now)
  const [cartPanelVisible, setCartPanelVisible] = useState(false);

  // New: Add to Cart Confirmation Modal
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [pendingAddToCart, setPendingAddToCart] = useState(null);

  // Checkout/Cart Panel State
  const [showCheckout, setShowCheckout] = useState(false);
  const [splitPayments, setSplitPayments] = useState([{ method: 'cash', amount: 0 }]);
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '' });
  const [receiptOption, setReceiptOption] = useState('none');
  const [checkoutError, setCheckoutError] = useState('');
  const [changeDue, setChangeDue] = useState(0);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [lastChange, setLastChange] = useState(0);

  // Ref for product list scroll
  const productListRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setCategories(mockCategories);
      setProducts(mockProducts);
      setError(null);
      setIsLoading(false);
    }, 300);
  }, []);

  // --- Filtering and Sorting ---
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products
    .filter((p) =>
      (!selectedCategory || p.category === selectedCategory.name) &&
      (!brandFilter || p.brand === brandFilter) &&
      (productSearch === '' ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.flavors && p.flavors.join(' ').toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.nicotine && p.nicotine.toLowerCase().includes(productSearch.toLowerCase()))
      )
    )
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'mostPopular') return (b.tags?.includes('Best Seller') ? 1 : 0) - (a.tags?.includes('Best Seller') ? 1 : 0);
      if (sortBy === 'newest') return b.id - a.id;
      return 0;
    });

  const handleSort = (value) => {
    setSortBy(value);
    let sorted = [...categories];
    if (value === 'alpha') sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (value === 'popularity') sorted.sort((a, b) => b.popularity - a.popularity);
    if (value === 'sales') sorted.sort((a, b) => b.salesVolume - a.salesVolume);
    setCategories(sorted);
  };

  // --- Shop Now: Scroll to product list ---
  const handleShopNow = (category) => {
    setSelectedCategory(category);
    setCartPanelVisible(true); // Show cart panel after Shop Now
    setTimeout(() => {
      if (productListRef.current) {
        productListRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Wait for render
  };

  // --- Cart, Wishlist, Quick View ---
  const handleAddToCart = (product) => {
    setPendingAddToCart(product);
    setShowAddToCartModal(true);
  };

  const confirmAddToCart = () => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === pendingAddToCart.id);
      if (exists) {
        return prev.map((item) =>
          item.id === pendingAddToCart.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...pendingAddToCart, qty: 1 }];
    });
    setShowAddToCartModal(false);
    setPendingAddToCart(null);
    setCartPanelVisible(true); // Show cart panel after adding
  };

  const cancelAddToCart = () => {
    setShowAddToCartModal(false);
    setPendingAddToCart(null);
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleUpdateCartQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const handleAddToWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((item) => item.id === product.id) ? prev : [...prev, product]
    );
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // --- Dynamic Search Suggestions ---
  const autoSuggestions = productSearch.length > 0
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            (p.flavors && p.flavors.join(' ').toLowerCase().includes(productSearch.toLowerCase())) ||
            (p.nicotine && p.nicotine.toLowerCase().includes(productSearch.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  // --- Product Recommendations ---
  const recommendedProducts = products.filter((p) => p.tags?.includes('Best Seller')).slice(0, 3);

  // --- Cart Calculations ---
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  let discount = 0;
  let taxRate = 0.12;
  if (cart.length > 0) {
    const allCats = [...new Set(cart.map(i => i.category))];
    if (allCats.length === 1) {
      const cat = categories.find(c => c.name === allCats[0]);
      if (cat) {
        discount = (subtotal * (cat.settings.discount || 0)) / 100;
        taxRate = (cat.settings.taxRate || 0) / 100;
      }
    }
  }
  const taxes = (subtotal - discount) * taxRate;
  const total = subtotal - discount + taxes;

  // --- Cart Adjustments ---
  const handleCartQtyChange = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const handleApplyDiscount = () => {
    alert('Discount feature coming soon!');
  };

  // --- Split Payments ---
  const handleSplitPaymentChange = (idx, field, value) => {
    setSplitPayments((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const handleAddSplitPayment = () => {
    setSplitPayments((prev) => [...prev, { method: 'cash', amount: 0 }]);
  };

  const handleRemoveSplitPayment = (idx) => {
    setSplitPayments((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Checkout Logic ---
  const handleProceedToCheckout = () => {
    setShowCheckout(true);
    setCheckoutError('');
    setChangeDue(0);
    setCartPanelVisible(false);
  };

  const handleCompleteCheckout = () => {
    for (let item of cart) {
      const prod = products.find((p) => p.id === item.id);
      if (!prod || prod.stock < item.qty) {
        setCheckoutError(`Insufficient stock for ${item.name}`);
        return;
      }
    }
    const paid = splitPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    if (paid < total) {
      setCheckoutError('Total payment is less than amount due.');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.qty };
        }
        return p;
      })
    );
    const change = paid - total;
    setChangeDue(change);
    setLastChange(change);
    setCheckoutError('');
    if (receiptOption === 'print') {
      window.print();
    }
    if (receiptOption === 'email' && customerDetails.email) {
      alert(`E-receipt sent to ${customerDetails.email} (mock)`);
    }
    setCart([]);
    setShowCheckout(false);
    setSplitPayments([{ method: 'cash', amount: 0 }]);
    setCustomerDetails({ name: '', email: '', phone: '' });
    setReceiptOption('none');
    setShowChangeModal(true); // Show the change modal
    setTimeout(() => {
      setChangeDue(0);
    }, 3000);
  };

  // --- Cart Total for Cart Button ---
  const cartTotal = subtotal;

  // --- Report Modal ---
  const handleShowReport = (category) => {
    setEditCategory(category);
    setShowReportModal(true);
  };

  // --- Edit Modal ---
  const handleShowEdit = (category) => {
    setEditCategory(category);
    setShowEditModal(true);
  };

  const handleEditCategorySave = () => {
    setCategories(categories.map(cat => cat.id === editCategory.id ? editCategory : cat));
    setShowEditModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 font-['Poppins',_Arial,_sans-serif]">
      {/* Fixed SideMenu */}
      <aside className="w-60 h-screen bg-gray-800 text-white fixed top-0 left-0 z-30 overflow-y-auto">
        <SideMenu />
      </aside>
      {/* Main Content with left margin */}
      <div className="flex-1 ml-60 p-6 relative">
        {/* Add to Cart Confirmation Modal */}
        {showAddToCartModal && pendingAddToCart && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-xs w-full relative pointer-events-auto">
              <button
                onClick={cancelAddToCart}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >&times;</button>
              <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                <FiShoppingCart className="text-black" /> Add to Cart
              </h2>
              <div className="mb-4 text-gray-700">
                Add <span className="font-semibold">{pendingAddToCart.name}</span> to cart?
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
                  onClick={confirmAddToCart}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                  onClick={cancelAddToCart}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Panel (shows after Shop Now or Add to Cart) */}
        {cartPanelVisible && (
          <div className="fixed top-20 right-6 z-50 w-96 max-w-full">
            <div className="bg-white rounded-lg shadow-2xl p-6">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <FiShoppingCart className="text-black" /> Cart Overview
              </h2>
              {cart.length === 0 ? (
                <div className="text-gray-500">Cart is empty.</div>
              ) : (
                <>
                  <ul>
                    {cart.map((item) => (
                      <li key={item.id} className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{item.name}</span>
                          <span className="ml-2 text-gray-500">₱{item.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => handleCartQtyChange(item.id, -1)}
                            disabled={item.qty <= 1}
                          >-</button>
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={e => handleUpdateCartQty(item.id, Number(e.target.value))}
                            className="w-10 border rounded px-1 py-0.5"
                          />
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => handleCartQtyChange(item.id, 1)}
                          >+</button>
                          <button
                            className="text-red-500 hover:text-red-700 ml-2"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >Remove</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-right">
                    <div>Subtotal: <span className="font-bold">₱{subtotal.toFixed(2)}</span></div>
                    <div>Discount: <span className="font-bold text-green-700">₱{discount.toFixed(2)}</span> <button className="text-xs text-blue-600 underline" onClick={handleApplyDiscount}>Apply</button></div>
                    <div>Tax: <span className="font-bold text-blue-700">₱{taxes.toFixed(2)}</span></div>
                    <div className="text-lg font-bold mt-2">Total: ₱{total.toFixed(2)}</div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex-1"
                      onClick={() => setCartPanelVisible(false)}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Checkout Modal with Payment Method */}
        {showCheckout && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div className="bg-white bg-opacity-90 rounded-lg shadow-2xl p-8 max-w-lg w-full relative">
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                <FiShoppingCart className="text-black" /> Checkout
              </h2>
              <div className="mb-4">
  <div className="font-semibold mb-1">Payment Method:</div>
  {splitPayments.map((pay, idx) => (
    <div key={idx} className="flex items-center gap-2 mb-2">
      <select
        value={pay.method}
        onChange={e => {
          const method = e.target.value;
          if (method === 'card') {
            setSplitPayments([{ method: 'card', amount: total }]);
          } else if (splitPayments.length === 1 && splitPayments[0].method === 'card') {
            // Switch from card to cash/mobile, reset to one row
            setSplitPayments([{ method, amount: 0 }]);
          } else {
            handleSplitPaymentChange(idx, 'method', method);
          }
        }}
        className="border rounded px-2 py-1"
      >
        {paymentMethods.map(pm => (
          <option key={pm.value} value={pm.value}>{pm.label}</option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        placeholder="Amount"
        value={pay.method === 'card' ? total : pay.amount}
        onChange={e => handleSplitPaymentChange(idx, 'amount', e.target.value)}
        className="border rounded px-2 py-1 w-24"
        disabled={pay.method === 'card'}
      />
      {splitPayments.length > 1 && pay.method !== 'card' && (
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleRemoveSplitPayment(idx)}
        >Remove</button>
      )}
    </div>
  ))}
  {/* Hide Add Split Payment if Card is selected */}
  {splitPayments[0].method !== 'card' && (
    <button
      className="text-blue-600 underline text-xs"
      onClick={handleAddSplitPayment}
    >Add Split Payment</button>
  )}
</div>
              <div className="mb-4">
                <div className="font-semibold mb-1">Customer Details (optional):</div>
                <input
                  type="text"
                  placeholder="Name"
                  value={customerDetails.name}
                  onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  className="border rounded px-2 py-1 w-full mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerDetails.email}
                  onChange={e => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                  className="border rounded px-2 py-1 w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={customerDetails.phone}
                  onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-4">
                <div className="font-semibold mb-1">Receipt Option:</div>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="receipt"
                    value="none"
                    checked={receiptOption === 'none'}
                    onChange={() => setReceiptOption('none')}
                  /> None
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="receipt"
                    value="print"
                    checked={receiptOption === 'print'}
                    onChange={() => setReceiptOption('print')}
                  /> <FiPrinter className="inline" /> Print
                </label>
                <label>
                  <input
                    type="radio"
                    name="receipt"
                    value="email"
                    checked={receiptOption === 'email'}
                    onChange={() => setReceiptOption('email')}
                  /> <FiMail className="inline" /> Email
                </label>
              </div>
              {checkoutError && (
                <div className="mb-2 text-red-600">{checkoutError}</div>
              )}
              <button
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 font-bold"
                onClick={handleCompleteCheckout}
              >
                Complete Payment
              </button>
              <button
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-bold mt-2"
                onClick={() => {
                  setSplitPayments([{ method: 'cash', amount: 0 }]);
                  setCheckoutError('');
                  setChangeDue(0);
                }}
              >
                Change Payment
              </button>
            </div>
          </div>
        )}

        {/* Show Change Modal after payment */}
        {showChangeModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div className="bg-white bg-opacity-95 rounded-lg shadow-2xl p-8 max-w-xs w-full text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-700">Change</h2>
              <div className="text-3xl font-bold mb-4 text-green-700">
                ₱{lastChange.toFixed(2)}
              </div>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 font-bold"
                onClick={() => setShowChangeModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Product Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, flavor, or nicotine..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {autoSuggestions.length > 0 && (
              <ul className="absolute bg-white border rounded shadow mt-1 w-full z-10">
                {autoSuggestions.map((p) => (
                  <li
                    key={p.id}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setProductSearch(p.name);
                      setSelectedCategory(categories.find(c => c.name === p.category));
                    }}
                  >
                    {p.name} <span className="text-xs text-gray-500">({p.category})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Brand:</span>
            <select
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white shadow-sm focus:outline-none"
            >
              <option value="">All</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <span className="font-semibold text-gray-700 ml-4">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white shadow-sm focus:outline-none"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Wishlist Summary */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <FiHeart className="text-pink-500" />
            <span className="font-semibold">Wishlist:</span>
            <span className="text-pink-700 font-bold">{wishlist.length} items</span>
          </div>
        </div>

        {/* Category or Product Listing */}
        {selectedCategory ? (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Categories
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FiTag className="text-black" /> Products in {selectedCategory.name}
            </h2>
            {/* Bulk Actions */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => alert('Bulk discount coming soon!')}
                className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 flex items-center gap-1"
              >
                <FiStar className="text-black" /> Bulk Discount
              </button>
              <button
                onClick={() => alert('Stock alert coming soon!')}
                className="px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 flex items-center gap-1"
              >
                <FiTrendingUp className="text-black" /> Set Stock Alert
              </button>
            </div>
            {/* Product Table */}
            <div ref={productListRef}>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded shadow font-['Poppins',_Arial,_sans-serif]">
                  <thead>
                    <tr className="bg-blue-100 text-blue-900 text-sm">
                      <th className="px-3 py-2 text-left">Image</th>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Brand</th>
                      <th className="px-3 py-2 text-left">Price</th>
                      <th className="px-3 py-2 text-left">Stock</th>
                      <th className="px-3 py-2 text-left">Attributes</th>
                      <th className="px-3 py-2 text-left">Tags</th>
                      <th className="px-3 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-t border-gray-200 hover:bg-blue-50">
                        <td className="px-3 py-2">
                          <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded shadow" />
                        </td>
                        <td className="px-3 py-2 font-semibold">{product.name}</td>
                        <td className="px-3 py-2">{product.brand}</td>
                        <td className="px-3 py-2">₱{product.price.toFixed(2)}</td>
                        <td className="px-3 py-2">
                          {product.stock > 5 ? (
                            <span className="text-green-600">In Stock</span>
                          ) : product.stock > 0 ? (
                            <span className="text-yellow-600">Only {product.stock} Left!</span>
                          ) : (
                            <span className="text-red-600">Out of Stock</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {product.attributes &&
                            Object.entries(product.attributes).map(([k, v]) => (
                              <span key={k} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1">
                                {k}: {v}
                              </span>
                            ))}
                        </td>
                        <td className="px-3 py-2">
                          {product.tags?.map(tag => (
                            <span key={tag} className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs mr-1">
                              <FiTag className="inline text-black" /> {tag}
                            </span>
                          ))}
                        </td>
                        <td className="px-3 py-2 flex gap-2">
                          <button
                            className="bg-blue-200 text-blue-900 px-2 py-1 rounded hover:bg-blue-300 flex items-center gap-1 text-xs"
                            onClick={() => setQuickViewProduct(product)}
                          >
                            <FiEye className="text-black" /> Quick View
                          </button>
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1 text-xs"
                            onClick={() => handleAddToCart(product)}
                          >
                            <FiShoppingCart className="text-black" /> Add to Cart
                          </button>
                          <button
                            className={`px-2 py-1 rounded flex items-center gap-1 text-xs ${wishlist.find(w => w.id === product.id) ? 'bg-pink-200 text-pink-700' : 'bg-gray-200 text-gray-700 hover:bg-pink-100'}`}
                            onClick={() =>
                              wishlist.find(w => w.id === product.id)
                                ? handleRemoveFromWishlist(product.id)
                                : handleAddToWishlist(product)
                            }
                          >
                            <FiHeart className="text-black" /> {wishlist.find(w => w.id === product.id) ? 'Wishlisted' : 'Wishlist'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Product Recommendations */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-2 text-blue-900">You Might Like</h3>
              <div className="flex gap-4">
                {recommendedProducts.map((prod) => (
                  <div key={prod.id} className="bg-white rounded shadow p-4 w-60">
                    <img src={prod.image} alt={prod.name} className="w-full h-24 object-cover rounded mb-2" />
                    <div className="font-semibold">{prod.name}</div>
                    <div className="text-blue-700 font-bold">₱{prod.price.toFixed(2)}</div>
                    <button
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 w-full"
                      onClick={() => handleAddToCart(prod)}
                    >
                      <FiShoppingCart className="inline text-black mr-1" /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <p className="text-gray-500">Loading categories...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
                  >
                    <img
                      src={category.image || 'https://via.placeholder.com/150'}
                      alt={category.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center gap-2">
                      {category.name}
                      {category.tags?.map(tag => (
                        <span key={tag} className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs ml-2">
                          <FiTag className="inline text-black" /> {tag}
                        </span>
                      ))}
                    </h2>
                    <p className="text-gray-700 mb-2">
                      <strong>Description:</strong> {category.description}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Products:</strong> {category.productCount}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                        <FiTrendingUp className="text-black" /> Popularity: {category.popularity}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                        <FiStar className="text-black" /> Sales: {category.salesVolume}
                      </span>
                    </div>
                    {/* Subcategories */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="mb-2">
                        <button
                          className="flex items-center text-blue-600 hover:underline text-sm"
                          onClick={() =>
                            setShowSubcategories((prev) => ({
                              ...prev,
                              [category.id]: !prev[category.id],
                            }))
                          }
                        >
                          {showSubcategories[category.id] ? <FiChevronUp /> : <FiChevronDown />}
                          {showSubcategories[category.id] ? 'Hide Subcategories' : 'Show Subcategories'}
                        </button>
                        {showSubcategories[category.id] && (
                          <ul className="ml-4 mt-2 list-disc text-sm">
                            {category.subcategories.map((sub, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                {sub.icon} {sub.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {/* Category Settings */}
                    <div className="mb-2">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2">
                        Tax: {category.settings.taxRate}%
                      </span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Discount: {category.settings.discount}%
                      </span>
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() => handleShopNow(category)}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FiShoppingCart className="mr-2 text-black" />
                        Shop Now
                      </button>
                      <button
                        className="flex items-center px-3 py-2 bg-blue-200 text-blue-900 rounded-lg hover:bg-blue-300 transition-colors text-xs"
                        onClick={() => handleShowReport(category)}
                      >
                        <FiTrendingUp className="mr-1 text-black" /> Report
                      </button>
                      <button
                        className="flex items-center px-3 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors text-xs"
                        onClick={() => handleShowEdit(category)}
                      >
                        <FiEdit className="mr-1 text-black" /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex gap-6">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-40 h-40 object-cover rounded shadow" />
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-blue-900">{quickViewProduct.name}</h2>
                  <div className="mb-1 text-gray-700">{quickViewProduct.description}</div>
                  <div className="mb-1 text-gray-700">
                    <span className="font-semibold">Brand:</span> {quickViewProduct.brand}
                  </div>
                  <div className="mb-1 text-gray-700">
                    <span className="font-semibold">Price:</span> ₱{quickViewProduct.price.toFixed(2)}
                  </div>
                  <div className="mb-1 text-gray-700">
                    <span className="font-semibold">Stock:</span>{' '}
                    {quickViewProduct.stock > 5 ? (
                      <span className="text-green-600">In Stock</span>
                    ) : quickViewProduct.stock > 0 ? (
                      <span className="text-yellow-600">Only {quickViewProduct.stock} Left!</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>
                  <div className="mb-1 text-gray-700">
                    <span className="font-semibold">Attributes:</span>{' '}
                    {quickViewProduct.attributes &&
                      Object.entries(quickViewProduct.attributes).map(([k, v]) => (
                        <span key={k} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1">
                          {k}: {v}
                        </span>
                      ))}
                  </div>
                  <div className="mb-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                      onClick={() => handleAddToCart(quickViewProduct)}
                    >
                      <FiShoppingCart className="text-black" /> Add to Cart
                    </button>
                    <button
                      className={`ml-2 px-3 py-1 rounded flex items-center gap-1 ${wishlist.find(w => w.id === quickViewProduct.id) ? 'bg-pink-200 text-pink-700' : 'bg-gray-200 text-gray-700 hover:bg-pink-100'}`}
                      onClick={() =>
                        wishlist.find(w => w.id === quickViewProduct.id)
                          ? handleRemoveFromWishlist(quickViewProduct.id)
                          : handleAddToWishlist(quickViewProduct)
                      }
                    >
                      <FiHeart className="text-black" /> {wishlist.find(w => w.id === quickViewProduct.id) ? 'Wishlisted' : 'Wishlist'}
                    </button>
                  </div>
                  {/* Ratings and Reviews */}
                  <div className="mb-2">
                    <span className="font-semibold">Ratings & Reviews:</span>
                    <ul className="ml-4 mt-1 list-disc text-sm">
                      {quickViewProduct.reviews && quickViewProduct.reviews.length > 0 ? (
                        quickViewProduct.reviews.map((r, idx) => (
                          <li key={idx} className="text-gray-700">
                            <FiMessageCircle className="inline mr-1 text-black" />
                            <span className="font-bold">{r.user}:</span> {r.comment}{' '}
                            <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No reviews yet.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && editCategory && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative">
              <button
                onClick={() => setShowReportModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                <FiTrendingUp className="text-black" /> {editCategory.name} Report
              </h2>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Total Products:</span> {editCategory.productCount}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Sales Volume:</span> {editCategory.salesVolume}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Popularity:</span> {editCategory.popularity}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Tags:</span> {editCategory.tags.join(', ') || 'None'}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Tax Rate:</span> {editCategory.settings.taxRate}%
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Discount:</span> {editCategory.settings.discount}%
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setShowReportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editCategory && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                <FiEdit className="text-black" /> Edit {editCategory.name}
              </h2>
              <div className="mb-2">
                <label className="block font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  value={editCategory.name}
                  onChange={e => setEditCategory({ ...editCategory, name: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={editCategory.description}
                  onChange={e => setEditCategory({ ...editCategory, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={editCategory.settings.taxRate}
                  onChange={e => setEditCategory({
                    ...editCategory,
                    settings: { ...editCategory.settings, taxRate: Number(e.target.value) }
                  })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={editCategory.settings.discount}
                  onChange={e => setEditCategory({
                    ...editCategory,
                    settings: { ...editCategory.settings, discount: Number(e.target.value) }
                  })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleEditCategorySave}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;