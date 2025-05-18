import React, { useState } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';

const InventoryManagement = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Vape Pen', stock: 50, price: 25.99 },
    { id: 2, name: 'Nicotine Salt', stock: 5, price: 15.99 },
    { id: 3, name: 'Vape Coil', stock: 15, price: 10.49 },
  ]);
  const [newItem, setNewItem] = useState({ name: '', stock: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.stock || !newItem.price) {
      alert('Please fill in all fields.');
      return;
    }
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    const itemToAdd = { ...newItem, id: newId, stock: parseInt(newItem.stock), price: parseFloat(newItem.price) };
    setItems([...items, itemToAdd]);
    setNewItem({ name: '', stock: '', price: '' });
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEditItem = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    setNewItem({ name: itemToEdit.name, stock: itemToEdit.stock, price: itemToEdit.price });
    setEditingId(id);
  };

  const handleUpdateItem = () => {
    setItems(
      items.map((item) =>
        item.id === editingId ? { ...item, ...newItem, stock: parseInt(newItem.stock), price: parseFloat(newItem.price) } : item
      )
    );
    setNewItem({ name: '', stock: '', price: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newItem.stock}
            onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            onClick={editingId ? handleUpdateItem : handleAddItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {editingId ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </div>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.stock}</td>
              <td className="px-4 py-2">${item.price.toFixed(2)}</td>
              <td className="px-4 py-2 space-x-2">
                <button onClick={() => handleEditItem(item.id)} className="text-blue-500 hover:underline">
                  <FiEdit />
                </button>
                <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:underline">
                  <FiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;