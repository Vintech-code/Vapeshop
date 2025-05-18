import { useState } from 'react';
import { FiPlus, FiTrash, FiEdit, FiCheck, FiX } from 'react-icons/fi';

const ProductManagement = ({ products, setProducts }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Paints'
  });
  const [editingId, setEditingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    const errors = {};
    const price = parseFloat(newProduct.price);
    const stock = parseInt(newProduct.stock, 10);

    if (!newProduct.name.trim()) errors.name = 'Name is required';
    if (isNaN(price) || price <= 0) errors.price = 'Price must be positive';
    if (isNaN(stock) || stock < 0) errors.stock = 'Stock cannot be negative';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock, 10),
          category: newProduct.category
        })
      });

      if (!response.ok) throw new Error('Failed to add product');
      
      const addedProduct = await response.json();
      setProducts([...products, addedProduct]);
      setNewProduct({ name: '', price: '', stock: '', category: 'Paints' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setNewProduct({
      ...product,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock, 10),
          category: newProduct.category
        })
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      const updatedProduct = await response.json();
      setProducts(products.map(p => p.id === editingId ? updatedProduct : p));
      setEditingId(null);
      setNewProduct({ name: '', price: '', stock: '', category: 'Paints' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(products.filter(p => p.id !== productId));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'text-red-500';
    if (stock < 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Add/Edit Product Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          {showSuccess && (
            <div className="mb-4 p-3 bg-green-200 text-green-700 rounded-lg">
              Product {editingId ? 'updated' : 'added'} successfully!
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-200 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}

          <form onSubmit={editingId ? handleUpdate : handleAddProduct} className="space-y-6">
            
            {/* Product Name */}
            <div>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                placeholder="Product Name"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
            </div>

            {/* Price */}
            <div>
              <input
                type="number"
                step="0.01"
                className={`w-full p-3 border rounded-lg ${validationErrors.price ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                placeholder="Price"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              {validationErrors.price && <p className="text-red-500 text-sm">{validationErrors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <input
                type="number"
                className={`w-full p-3 border rounded-lg ${validationErrors.stock ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                placeholder="Stock Quantity"
                value={newProduct.stock}
                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
              {validationErrors.stock && <p className="text-red-500 text-sm">{validationErrors.stock}</p>}
            </div>

            {/* Category */}
            <div>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none"
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value=""></option>
              
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Loading...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
            </div>

            {/* Cancel Button if Editing */}
            {editingId && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNewProduct({ name: '', price: '', stock: '', category: 'Paints' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX /> Cancel Editing
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Product Inventory */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Manage Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-4 px-6 text-left text-gray-600">Product</th>
                  <th className="py-4 px-6 text-left text-gray-600">Category</th>
                  <th className="py-4 px-6 text-left text-gray-600">Price</th>
                  <th className="py-4 px-6 text-left text-gray-600">Stock</th>
                  <th className="py-4 px-6 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6">{product.name}</td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-gray-600">{product.category}</span>
                    </td>
                    <td className="py-4 px-6">${product.price.toFixed(2)}</td>
                    <td className={`py-4 px-6 font-semibold ${getStockStatus(product.stock)}`}>
                      {product.stock}
                    </td>
                    <td className="py-4 px-6 flex gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="py-6 text-center text-gray-500">
                No products found. Start by adding your first product!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
