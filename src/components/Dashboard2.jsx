import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiStar, FiAlertTriangle } from 'react-icons/fi';
import SideMenu from './SideMenu';
import Header from './Header';

const mockFavorites = [
  { id: 1, name: "Vape Pen", price: 12.99, stock: 10, category: "Vape" },
  { id: 2, name: "Nicotine Juice", price: 5.49, stock: 15, category: "Liquids" },
];

const categories = ["Vape", "Liquids", "Accessories"];

const Dashboard2 = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const exampleProducts = [
      { id: 1, name: "Vape Pen", price: 12.99, stock: 10, category: "Vape", sku: "VP-001", barcode: "123456" },
      { id: 2, name: "Nicotine Juice", price: 5.49, stock: 2, category: "Liquids", sku: "NJ-002", barcode: "234567" },
      { id: 3, name: "Vape Battery", price: 12.99, stock: 7, category: "Accessories", sku: "VB-003", barcode: "345678" },
      { id: 4, name: "Vape Pod", price: 9.99, stock: 5, category: "Vape", sku: "VP-004", barcode: "456789" },
      { id: 5, name: "Coil Replacement", price: 3.99, stock: 1, category: "Accessories", sku: "CR-005", barcode: "567890" },
      { id: 6, name: "Vape Juice - Strawberry", price: 6.99, stock: 12, category: "Liquids", sku: "VJS-006", barcode: "678901" },
      { id: 7, name: "Vape Juice - Mint", price: 6.99, stock: 8, category: "Liquids", sku: "VJM-007", barcode: "789012" },
    ];
    setProducts(exampleProducts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setLowStockAlerts(products.filter(p => p.stock > 0 && p.stock < 3));
  }, [products]);

  const filteredProducts = products.filter(p =>
    (!selectedCategory || p.category === selectedCategory) &&
    (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.barcode && p.barcode.includes(search))
    )
  );

  // Shop Now Handler: Blink effect then navigate to Category page.
  const handleShopNow = () => {
    document.body.classList.add('bg-yellow-200');
    setTimeout(() => {
      document.body.classList.remove('bg-yellow-200');
      navigate('/category');
    }, 300);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      {/* Fixed Side Menu */}
      <aside className="w-60 h-screen bg-gray-800 text-white fixed top-0 left-0 z-30 overflow-y-auto">
        <SideMenu />
      </aside>
      <div className="flex-1 flex flex-col" style={{ marginLeft: '15rem' }}>
        <Header />
        <main className="flex-1 p-4">
          {/* Background Welcome Message / Features */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-700">Welcome to the Vape Shop</h1>
            <p className="text-sm text-gray-500">
              Browse products below and press "Shop Now" to begin shopping.
            </p>
          </div>

          {/* Product Search, Category Filter, and Favorites */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 flex items-center bg-white rounded-lg shadow px-3">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by name, SKU, or barcode..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 py-2 bg-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`px-3 py-2 rounded-lg ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-semibold">Favorites:</span>
              {mockFavorites.map(fav => (
                <span key={fav.id} className="px-2 py-1 bg-yellow-100 rounded">
                  <FiStar className="inline text-yellow-500" /> {fav.name}
                </span>
              ))}
            </div>
          </div>

          {/* Product List Only */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Available Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {isLoading ? (
                <p className="text-gray-500">Loading products...</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-500">No products found</p>
              ) : (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg text-left flex flex-col items-start justify-between ${
                      product.stock === 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">₱{product.price.toFixed(2)}</p>
                      <p className="text-xs mt-2">
                        Stock: {product.stock}{' '}
                        {product.stock < 3 && <FiAlertTriangle className="inline text-yellow-500" />}
                      </p>
                    </div>
                    <button
                      className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
                      onClick={handleShopNow}
                      disabled={product.stock === 0}
                    >
                      <FiShoppingCart /> Shop Now
                    </button>
                  </div>
                ))
              )}
            </div>
            {/* Low Stock Alerts */}
            {lowStockAlerts.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded text-yellow-800 flex items-center gap-2">
                <FiAlertTriangle className="text-yellow-500" />
                Low stock: {lowStockAlerts.map(p => p.name).join(', ')}
              </div>
            )}
          </div>
        </main>
      </div>
      {/* Simple blink effect style */}
      <style>{`
        .bg-yellow-200 {
          transition: background 0.3s;
          background: #fefcbf !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard2;
