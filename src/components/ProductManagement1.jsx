import React, { useState } from 'react';

const ProductManagement = ({ products = [], setProducts }) => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    setProducts([
      ...products,
      {
        id: products.length + 1,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
      },
    ]);
    setNewProduct({ name: '', price: '', stock: '' });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <form onSubmit={handleAddProduct} className="mb-6 flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      <ul>
        {products.map(product => (
          <li key={product.id} className="border-b py-2 flex justify-between">
            <span>{product.name}</span>
            <span>${product.price.toFixed(2)}</span>
            <span>Stock: {product.stock}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;