import React, { useState, useEffect } from 'react';
import API from '../api';
import { FiSearch, FiClock, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import SideMenu from '../layouts/SideMenu'; 
import Header from '../layouts/Header';


const PurchaseHistoryCashier = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get('/purchases', {
          params: {
            page: currentPage,
            search: searchTerm,
            sort_by: 'created_at',
            sort_order: 'desc'
          }
        });
        
        console.log('API Response:', response); // Debugging
        
        // Handle different possible response structures
        if (response.data) {
          // Case 1: Laravel paginated response
          if (response.data.data && response.data.meta) {
            setPurchases(response.data.data);
            setTotalPages(response.data.meta.last_page);
          } 
          // Case 2: Simple array response
          else if (Array.isArray(response.data)) {
            setPurchases(response.data);
            setTotalPages(1);
          }
          // Case 3: Other structure
          else {
            setPurchases([]);
            setTotalPages(1);
            console.warn('Unexpected API response structure', response.data);
          }
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
        setError('Failed to load purchase history. Please try again.');
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase record?')) return;
    
    try {
      await API.delete(`/purchases/${id}`);
      fetchPurchases();
    } catch (error) {
      console.error('Error deleting purchase:', error);
      setError('Failed to delete purchase');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  // Safe filtering function
  const filteredPurchases = purchases.filter(purchase => {
    if (!purchase) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (purchase.user?.name?.toLowerCase().includes(searchLower)) ||
      (purchase.payment_method?.toLowerCase().includes(searchLower)) ||
      (purchase.total_amount?.toString().includes(searchTerm)) ||
      (purchase.created_at && formatDate(purchase.created_at).toLowerCase().includes(searchLower))
    );
  });

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
      <div className="max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Purchase History</h2>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cashier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiClock className="mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatDate(purchase.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiUser className="mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {purchase.user?.name || 'Cashier'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {purchase.payment_method || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {`₱${Number(purchase.total_amount || 0).toFixed(2)}`}
                    </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(purchase.items?.length || 0)} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedPurchase(purchase)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No purchases found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Purchase Detail Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Purchase Details</h3>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Transaction ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPurchase.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedPurchase.created_at)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cashier</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPurchase.user?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedPurchase.payment_method || 'unknown'}
                  </p>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Items Purchased</h4>
                {selectedPurchase.items?.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPurchase.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{(item.price || 0).toFixed(2)}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{item.quantity || 0}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                            {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center py-4">No items found for this purchase</p>
                )}
              </div>

              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Subtotal:</span>
                    <span>{(selectedPurchase.total_amount || 0).toFixed(2)}</span>
                  </div>
                  {selectedPurchase.payment_method === 'cash' && (
                    <>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Cash Received:</span>
                        <span>{(selectedPurchase.cash_received || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t font-bold">
                        <span>Change:</span>
                        <span>{(selectedPurchase.change || 0).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </main>
    </div>  
  </div>
  );
};

export default PurchaseHistoryCashier;