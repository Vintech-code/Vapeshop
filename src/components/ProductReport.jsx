import React, { useState, useEffect } from 'react';
import { FiPrinter, FiDownload, FiFilter, FiX } from 'react-icons/fi';
import { CSVLink } from 'react-csv';
import SideMenu from '../layouts/SideMenu';
import Header from '../layouts/Header';
import API from '../api';

const ProductReport = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minStock: '',
    maxStock: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, dateRange]);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...products];
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(product => 
        product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    // Apply stock filters
    if (filters.minStock) {
      result = result.filter(product => 
        product.stock >= parseInt(filters.minStock)
      );
    }
    if (filters.maxStock) {
      result = result.filter(product => 
        product.stock <= parseInt(filters.maxStock)
      );
    }
    
    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      result = result.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }
    
    // Apply date range filter if dates are provided
    if (dateRange.start && dateRange.end) {
      result = result.filter(product => {
        const productDate = new Date(product.created_at);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return productDate >= startDate && productDate <= endDate;
      });
    }
    
    setFilteredProducts(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minStock: '',
      maxStock: '',
      minPrice: '',
      maxPrice: ''
    });
    setDateRange({
      start: '',
      end: ''
    });
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
  };

  const getStockStatusClass = (stock) => {
    if (stock <= 0) return 'bg-red-100 text-red-800';
    if (stock <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const csvData = filteredProducts.map(product => ({
    ID: product.id,
    Name: product.name,
    Category: product.category,
    Price: product.price,
    Stock: product.stock,
    'Stock Status': getStockStatus(product.stock),
    'Created At': new Date(product.created_at).toLocaleDateString(),
    'Image URL': product.image_url || ''
  }));

  const printReport = () => {
    const printContent = document.getElementById('report-content').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Product Report</h1>
        <div class="mb-4">
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Total Products: ${filteredProducts.length}</p>
        </div>
        ${printContent}
      </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed SideMenu */}
      <div className="h-screen w-64 fixed top-0 left-0 z-30 bg-white border-r shadow-lg">
        <SideMenu />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Product Report</h1>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <FiFilter /> Filters
                </button>
                
                <CSVLink 
                  data={csvData}
                  filename={"products-report.csv"}
                  className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <FiDownload /> Export CSV
                </CSVLink>
                
                <button
                  onClick={printReport}
                  className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <FiPrinter /> Print
                </button>
              </div>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <FiX className="text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      placeholder="Filter by category"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="minStock"
                        value={filters.minStock}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        name="maxStock"
                        value={filters.maxStock}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        name="start"
                        value={dateRange.start}
                        onChange={handleDateChange}
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="date"
                        name="end"
                        value={dateRange.end}
                        onChange={handleDateChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                <p className="text-2xl font-bold">{filteredProducts.length}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Out of Stock</h3>
                <p className="text-2xl font-bold">
                  {filteredProducts.filter(p => p.stock <= 0).length}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Low Stock (≤5)</h3>
                <p className="text-2xl font-bold">
                  {filteredProducts.filter(p => p.stock > 0 && p.stock <= 5).length}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Inventory Value</h3>
                <p className="text-2xl font-bold">
                  ₱{filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
                </p>
              </div>
            </div>
            
            {/* Report Table */}
            <div id="report-content" className="bg-white rounded-lg shadow overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No products found matching your filters
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category}</td>
                          <td className="text-right">₱{(parseFloat(product.price) || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusClass(product.stock)}`}>
                              {getStockStatus(product.stock)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">No image</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Charts Section (would need charting library) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Products by Category</h3>
                {/* Placeholder for chart - would use Chart.js or similar */}
                <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                  Category Distribution Chart
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Stock Status Overview</h3>
                {/* Placeholder for chart - would use Chart.js or similar */}
                <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                  Stock Status Chart
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductReport;