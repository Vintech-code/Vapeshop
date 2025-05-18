import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';

const CurrentItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Mock API call to fetch current items
        const mockItems = [
          { id: 1, name: 'Vape Pen', stock: 50, price: 25.99 },
          { id: 2, name: 'Nicotine Salt', stock: 5, price: 15.99 },
          { id: 3, name: 'Vape Coil', stock: 15, price: 10.49 },
          { id: 4, name: 'Vape Tank', stock: 20, price: 35.99 },
          { id: 5, name: 'Disposable Vape', stock: 8, price: 12.99 }, // New Item
          { id: 6, name: 'E-Liquid 50ml', stock: 30, price: 18.99 }, // New Item
          { id: 7, name: 'Vape Mod', stock: 10, price: 45.99 }, // New Item
        ];
        setItems(mockItems);
        setError(null);
      } catch (err) {
        setError('Failed to fetch items.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Current Items</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading items...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.name}</h2>
                <p className={`mb-2 ${item.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                  <strong>Stock:</strong> {item.stock}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Price:</strong> ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => alert(`Edit item: ${item.name}`)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FiEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>  
  );
};

export default CurrentItems;