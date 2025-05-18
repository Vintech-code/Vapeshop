import { useState } from 'react';
import { FiEdit, FiTrash, FiPlus } from 'react-icons/fi';

const SalesManagement = () => {
    const [sales, setSales] = useState([]);
    const [newSale, setNewSale] = useState({ customer: '', total: '', date: '', items: '' });
    const [editingId, setEditingId] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!newSale.customer.trim()) errors.customer = 'Customer name is required';
        if (!newSale.total || parseFloat(newSale.total) <= 0) errors.total = 'Total must be positive';
        if (!newSale.date.trim()) errors.date = 'Date is required';
        if (!newSale.items || parseInt(newSale.items, 10) <= 0) errors.items = 'Items must be greater than 0';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddSale = () => {
        if (!validateForm()) return;

        const newId = sales.length > 0 ? Math.max(...sales.map(sale => sale.id)) + 1 : 1;
        const saleToAdd = { ...newSale, id: newId, total: parseFloat(newSale.total), items: parseInt(newSale.items, 10) };
        setSales([...sales, saleToAdd]);
        setNewSale({ customer: '', total: '', date: '', items: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleEditSale = (sale) => {
        setEditingId(sale.id);
        setNewSale({ ...sale, total: sale.total.toString(), items: sale.items.toString() });
    };

    const handleUpdateSale = () => {
        if (!validateForm()) return;

        setSales(sales.map(sale => (sale.id === editingId ? { ...newSale, id: editingId, total: parseFloat(newSale.total), items: parseInt(newSale.items, 10) } : sale)));
        setEditingId(null);
        setNewSale({ customer: '', total: '', date: '', items: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleDeleteSale = (id) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            setSales(sales.filter(sale => sale.id !== id));
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Sales Management</h1>

                {/* Add/Edit Sale Form */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Sale' : 'Add New Sale'}</h2>
                    {showSuccess && (
                        <div className="mb-4 p-3 bg-green-200 text-green-700 rounded-lg">
                            Sale {editingId ? 'updated' : 'added'} successfully!
                        </div>
                    )}
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={newSale.customer}
                            onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
                            className={`w-full p-3 border rounded-lg ${validationErrors.customer ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        />
                        {validationErrors.customer && <p className="text-red-500 text-sm">{validationErrors.customer}</p>}

                        <input
                            type="number"
                            placeholder="Total Amount"
                            value={newSale.total}
                            onChange={(e) => setNewSale({ ...newSale, total: e.target.value })}
                            className={`w-full p-3 border rounded-lg ${validationErrors.total ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        />
                        {validationErrors.total && <p className="text-red-500 text-sm">{validationErrors.total}</p>}

                        <input
                            type="date"
                            value={newSale.date}
                            onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                            className={`w-full p-3 border rounded-lg ${validationErrors.date ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        />
                        {validationErrors.date && <p className="text-red-500 text-sm">{validationErrors.date}</p>}

                        <input
                            type="number"
                            placeholder="Number of Items"
                            value={newSale.items}
                            onChange={(e) => setNewSale({ ...newSale, items: e.target.value })}
                            className={`w-full p-3 border rounded-lg ${validationErrors.items ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        />
                        {validationErrors.items && <p className="text-red-500 text-sm">{validationErrors.items}</p>}

                        <button
                            onClick={editingId ? handleUpdateSale : handleAddSale}
                            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {editingId ? 'Update Sale' : 'Add Sale'}
                        </button>
                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setNewSale({ customer: '', total: '', date: '', items: '' });
                                }}
                                className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg mt-2 hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Sales List */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Sales List</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-3 text-left">Customer</th>
                                <th className="border border-gray-300 p-3 text-left">Total</th>
                                <th className="border border-gray-300 p-3 text-left">Date</th>
                                <th className="border border-gray-300 p-3 text-left">Items</th>
                                <th className="border border-gray-300 p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="border border-gray-300 p-3">{sale.customer}</td>
                                    <td className="border border-gray-300 p-3">${sale.total.toFixed(2)}</td>
                                    <td className="border border-gray-300 p-3">{sale.date}</td>
                                    <td className="border border-gray-300 p-3">{sale.items}</td>
                                    <td className="border border-gray-300 p-3 flex gap-2">
                                        <button
                                            onClick={() => handleEditSale(sale)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSale(sale.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {sales.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No sales available. Start by adding your first sale!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;