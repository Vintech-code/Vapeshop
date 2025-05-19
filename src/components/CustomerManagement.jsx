import { useState } from 'react';
import { FiEdit, FiTrash, FiGift, FiMail, FiTag, FiStar, FiUserCheck, FiMessageCircle } from 'react-icons/fi';
import SideMenu from '../layouts/SideMenu';

// Use localStorage to sync customers with Dashboard2
const initialCustomers = JSON.parse(localStorage.getItem('customers')) || [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    email: 'juan@email.com',
    phone: '09171234567',
    address: 'Manila, PH',
    birthday: '1995-05-10',
    tags: ['VIP', 'Regular Buyer'],
    loyaltyPoints: 120,
    tier: 'Gold',
    preferences: 'Prefers menthol flavors',
    purchaseHistory: [
      { date: '2025-04-10', product: 'Vape Pen', amount: 800 },
      { date: '2025-04-15', product: 'E-Liquid 50ml', amount: 500 },
    ],
    feedback: [
      { date: '2025-04-16', message: 'Great service!' }
    ],
    coupons: [{ code: 'VIP10', discount: '10%' }],
    returns: [{ date: '2025-04-18', product: 'E-Liquid 50ml', reason: 'Wrong flavor' }],
    consent: true,
  },
];

const tagColors = {
  'VIP': 'bg-yellow-200 text-yellow-800',
  'Regular Buyer': 'bg-blue-200 text-blue-800',
  'New Customer': 'bg-green-200 text-green-800',
};

const CustomerManagement = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [newCustomer, setNewCustomer] = useState({
    name: '', email: '', phone: '', address: '', birthday: '', tags: [], loyaltyPoints: 0, tier: '', preferences: '', consent: true
  });
  const [editingId, setEditingId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Sync customers to localStorage for Dashboard2 to read
  const syncCustomers = (updatedCustomers) => {
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  };

  const validateForm = () => {
    const errors = {};
    if (!newCustomer.name.trim()) errors.name = 'Name is required';
    if (!newCustomer.email.trim()) errors.email = 'Email is required';
    if (!newCustomer.phone.trim()) errors.phone = 'Phone number is required';
    if (!newCustomer.address.trim()) errors.address = 'Address is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCustomer = () => {
    if (!validateForm()) return;
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const customerToAdd = { ...newCustomer, id: newId, loyaltyPoints: 0, tier: 'Bronze', tags: ['New Customer'], purchaseHistory: [], feedback: [], coupons: [], returns: [], consent: true };
    const updatedCustomers = [...customers, customerToAdd];
    syncCustomers(updatedCustomers);
    setNewCustomer({ name: '', email: '', phone: '', address: '', birthday: '', tags: [], loyaltyPoints: 0, tier: '', preferences: '', consent: true });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEditCustomer = (customer) => {
    setEditingId(customer.id);
    setNewCustomer({ ...customer });
  };

  const handleUpdateCustomer = () => {
    if (!validateForm()) return;
    const updatedCustomers = customers.map(c => (c.id === editingId ? { ...newCustomer, id: editingId } : c));
    syncCustomers(updatedCustomers);
    setEditingId(null);
    setNewCustomer({ name: '', email: '', phone: '', address: '', birthday: '', tags: [], loyaltyPoints: 0, tier: '', preferences: '', consent: true });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const updatedCustomers = customers.filter(c => c.id !== id);
      syncCustomers(updatedCustomers);
    }
  };

  const handleSendMessage = () => {
    setShowMessageModal(false);
    setMessage('');
    alert('Message sent to customer!');
  };

  const handleTagChange = (tag) => {
    setNewCustomer((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 font-['Poppins',_Arial,_sans-serif]">
      <SideMenu />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-extrabold mb-4 text-blue-900 flex items-center gap-2">
            <FiUserCheck className="text-black" /> Customer Management
          </h1>

          {/* Add/Edit Customer Form */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
            {showSuccess && (
              <div className="mb-4 p-3 bg-green-200 text-green-700 rounded-lg">
                Customer {editingId ? 'updated' : 'added'} successfully!
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                />
                {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                />
                {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                />
                {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                />
                {validationErrors.address && <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>}
              </div>
              <div>
                <input
                  type="date"
                  placeholder="Birthday"
                  value={newCustomer.birthday}
                  onChange={(e) => setNewCustomer({ ...newCustomer, birthday: e.target.value })}
                  className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none"
                />
                <span className="text-xs text-gray-500">Birthday (for greetings & promos)</span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Preferences (e.g. flavors)"
                  value={newCustomer.preferences}
                  onChange={(e) => setNewCustomer({ ...newCustomer, preferences: e.target.value })}
                  className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none"
                />
                <span className="text-xs text-gray-500">Product Preferences</span>
              </div>
              <div className="col-span-3">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold">Tags:</span>
                  {['VIP', 'Regular Buyer', 'New Customer'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${tagColors[tag]} border-blue-300 mr-2`}
                      onClick={() => handleTagChange(tag)}
                      style={{ opacity: newCustomer.tags.includes(tag) ? 1 : 0.5 }}
                    >
                      <FiTag className="inline mr-1 text-black" /> {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={editingId ? handleUpdateCustomer : handleAddCustomer}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingId ? 'Update Customer' : 'Add Customer'}
              </button>
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setNewCustomer({ name: '', email: '', phone: '', address: '', birthday: '', tags: [], loyaltyPoints: 0, tier: '', preferences: '', consent: true });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Customer List */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Customer List</h2>
            <table className="w-full border-collapse border border-gray-300 font-['Poppins',_Arial,_sans-serif]">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="border border-gray-300 p-3 text-left">Name</th>
                  <th className="border border-gray-300 p-3 text-left">Email</th>
                  <th className="border border-gray-300 p-3 text-left">Phone</th>
                  <th className="border border-gray-300 p-3 text-left">Tags</th>
                  <th className="border border-gray-300 p-3 text-left">Loyalty</th>
                  <th className="border border-gray-300 p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-blue-50 transition-colors">
                    <td className="border border-gray-300 p-3 font-semibold cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                      <span className="flex items-center gap-2">
                        <FiUserCheck className="text-black" /> {customer.name}
                        {customer.birthday && (
                          <FiGift className="ml-1 text-pink-500" title="Birthday" />
                        )}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3">{customer.email}</td>
                    <td className="border border-gray-300 p-3">{customer.phone}</td>
                    <td className="border border-gray-300 p-3">
                      {customer.tags?.map(tag => (
                        <span key={tag} className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mr-1 ${tagColors[tag]}`}>
                          <FiTag className="inline text-black" /> {tag}
                        </span>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <span className="flex items-center gap-1">
                        <FiStar className="text-yellow-500" /> {customer.loyaltyPoints || 0} pts
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{customer.tier || 'Bronze'}</span>
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 flex gap-2">
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FiTrash />
                      </button>
                      <button
                        onClick={() => { setSelectedCustomer(customer); setShowMessageModal(true); }}
                        className="text-green-600 hover:text-green-800"
                        title="Send Message"
                      >
                        <FiMail />
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

        {/* Customer Profile Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full relative font-['Poppins',_Arial,_sans-serif]">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-2 text-blue-900 flex items-center gap-2">
                <FiUserCheck className="text-black" /> {selectedCustomer.name}
                {selectedCustomer.birthday && (
                  <span className="ml-2 flex items-center gap-1 text-pink-500 text-base">
                    <FiGift /> {selectedCustomer.birthday}
                  </span>
                )}
              </h2>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Email:</span> {selectedCustomer.email}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Phone:</span> {selectedCustomer.phone}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Address:</span> {selectedCustomer.address}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Preferences:</span> {selectedCustomer.preferences || <span className="text-gray-400">None</span>}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Tags:</span>{' '}
                {selectedCustomer.tags?.map(tag => (
                  <span key={tag} className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mr-1 ${tagColors[tag]}`}>
                    <FiTag className="inline text-black" /> {tag}
                  </span>
                ))}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Loyalty Points:</span> <span className="text-yellow-700 font-bold">{selectedCustomer.loyaltyPoints || 0}</span> ({selectedCustomer.tier || 'Bronze'})
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Consent for Communication:</span>{' '}
                <span className={selectedCustomer.consent ? 'text-green-600' : 'text-red-600'}>
                  {selectedCustomer.consent ? 'Opted In' : 'Opted Out'}
                </span>
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Coupons:</span>{' '}
                {selectedCustomer.coupons?.length > 0
                  ? selectedCustomer.coupons.map(c => (
                      <span key={c.code} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                        {c.code} ({c.discount})
                      </span>
                    ))
                  : <span className="text-gray-400">None</span>}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Refunds/Returns:</span>{' '}
                {selectedCustomer.returns?.length > 0
                  ? selectedCustomer.returns.map(r => (
                      <span key={r.date + r.product} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                        {r.product} ({r.reason})
                      </span>
                    ))
                  : <span className="text-gray-400">None</span>}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Purchase History:</span>
                <table className="w-full mt-2 text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.purchaseHistory?.length > 0 ? (
                      selectedCustomer.purchaseHistory.map((ph, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="p-2">{ph.date}</td>
                          <td className="p-2">{ph.product}</td>
                          <td className="p-2">₱{ph.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-gray-400 p-2">No purchases yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Feedback & Reviews:</span>
                <ul className="ml-4 mt-1 list-disc text-sm">
                  {selectedCustomer.feedback?.length > 0 ? (
                    selectedCustomer.feedback.map((f, idx) => (
                      <li key={idx} className="text-gray-700">
                        <FiMessageCircle className="inline mr-1 text-black" /> {f.message} <span className="text-xs text-gray-400">({f.date})</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">No feedback yet.</li>
                  )}
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
                  onClick={() => setShowMessageModal(true)}
                >
                  <FiMail className="text-black" /> Send Message
                </button>
                <button
                  className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 flex items-center gap-1"
                  onClick={() => alert('Loyalty program details coming soon!')}
                >
                  <FiStar className="text-black" /> Loyalty Program
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button
                onClick={() => setShowMessageModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                <FiMail className="text-black" /> Send Message
              </h2>
              <textarea
                className="w-full border border-gray-300 rounded p-2 mb-4"
                rows={4}
                placeholder="Type your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;