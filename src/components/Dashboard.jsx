import { useState, useEffect } from 'react';
import { FiBox, FiEye, FiEyeOff, FiPlus } from 'react-icons/fi';
import { HiEyeSlash } from "react-icons/hi2";
import SideMenu from '../layouts/SideMenu';
import Header from '../layouts/Header';
import API from '../api';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    hidden: 0,
    outOfStock: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [categoryChart, setCategoryChart] = useState({ labels: [], data: [] });
  const [stockHistory, setStockHistory] = useState({ labels: [], data: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats, category chart, stock history, and recent products
  const fetchDashboard = async () => {
    try {
      setIsLoading(true);

      // Stats cards
      const statsRes = await API.get('/dashboard/product-stats');
      setStats(statsRes.data);

      // Recent products
      const recentRes = await API.get('/dashboard/recent-products');
      setRecentProducts(recentRes.data);

      // Category chart data
      const catRes = await API.get('/dashboard/category-counts');
      setCategoryChart({
        labels: catRes.data.labels,
        data: catRes.data.data,
      });

      // Stock history (example: total stock per day, last 7 days)
      const stockRes = await API.get('/dashboard/stock-history');
      setStockHistory({
        labels: stockRes.data.labels,
        data: stockRes.data.data,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SideMenu */}
      <div className="h-screen w-64 fixed top-0 left-0 z-30 bg-white border-r shadow-lg">
        <SideMenu />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FiBox size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.total}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FiEye size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Products</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.active}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="p-3 rounded-full bg-gray-200 text-gray-600 mr-4">
                  <HiEyeSlash size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Hidden Products</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.hidden}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <FiEyeOff size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.outOfStock}</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Bar Chart: Products by Category */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Products by Category</h2>
                <Bar
                  data={{
                    labels: categoryChart.labels,
                    datasets: [
                      {
                        label: 'Products',
                        data: categoryChart.data,
                        backgroundColor: 'rgba(37, 99, 235, 0.7)',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </div>
              {/* Line Chart: Stock History */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Total Stock (Last 7 Days)</h2>
                <Line
                  data={{
                    labels: stockHistory.labels,
                    datasets: [
                      {
                        label: 'Total Stock',
                        data: stockHistory.data,
                        borderColor: 'rgba(16, 185, 129, 1)',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </div>
            </div>

            {/* Recent Products Table */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Recent Products</h2>
                <a
                  href="/products"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <FiPlus /> Manage Products
                </a>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">Loading...</td>
                      </tr>
                    ) : recentProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">No products found.</td>
                      </tr>
                    ) : (
                      recentProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">₱{Number(product.price).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.is_hidden ? (
                              <span className="text-xs text-white bg-gray-500 px-2 py-1 rounded-full">Hidden</span>
                            ) : product.stock === 0 ? (
                              <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-full">Out of Stock</span>
                            ) : (
                              <span className="text-xs text-white bg-green-500 px-2 py-1 rounded-full">Active</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
