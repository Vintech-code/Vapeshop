import { useState } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';

const CustomerName = () => {
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
    const [editingId, setEditingId] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!newCustomer.name.trim()) errors.name = 'Name is required';
        if (!newCustomer.email.trim()) errors.email = 'Email is required';
        if (!newCustomer.phone.trim()) errors.phone = 'Phone number is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCustomer = () => {
        if (!validateForm()) return;

        const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        const customerToAdd = { ...newCustomer, id: newId };
        setCustomers([...customers, customerToAdd]);
        setNewCustomer({ name: '', email: '', phone: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleEditCustomer = (customer) => {
        setEditingId(customer.id);
        setNewCustomer({ ...customer });
    };

    const handleUpdateCustomer = () => {
        if (!validateForm()) return;

        setCustomers(customers.map(c => (c.id === editingId ? { ...newCustomer, id: editingId } : c)));
        setEditingId(null);
        setNewCustomer({ name: '', email: '', phone: '' });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleDeleteCustomer = (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            setCustomers(customers.filter(c => c.id !== id));
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

                {/* Add/Edit Customer Form */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
                    {showSuccess && (
                        <div className="mb-4 p-3 bg-green-200 text-green-700 rounded-lg">
                            Customer {editingId ? 'updated' : 'added'} successfully!
                        </div>
                    )}
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            className={`w-full p-2 border rounded ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}

                        <input
                            type="email"
                            placeholder="Email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            className={`w-full p-2 border rounded ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}

                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            className={`w-full p-2 border rounded ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {validationErrors.phone && <p className="text-red-500 text-sm">{validationErrors.phone}</p>}

                        <button
                            onClick={editingId ? handleUpdateCustomer : handleAddCustomer}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            {editingId ? 'Update Customer' : 'Add Customer'}
                        </button>
                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setNewCustomer({ name: '', email: '', phone: '' });
                                }}
                                className="w-full bg-gray-300 text-gray-700 p-2 rounded mt-2 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Customer List */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Customer List</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">Name</th>
                                <th className="border border-gray-300 p-2">Email</th>
                                <th className="border border-gray-300 p-2">Phone</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2">{customer.name}</td>
                                    <td className="border border-gray-300 p-2">{customer.email}</td>
                                    <td className="border border-gray-300 p-2">{customer.phone}</td>
                                    <td className="border border-gray-300 p-2 flex gap-2">
                                        <button
                                            onClick={() => handleEditCustomer(customer)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCustomer(customer.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {customers.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No customers available. Start by adding your first customer!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerName;