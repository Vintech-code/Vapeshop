import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBox,
  FiClipboard,
  FiShoppingCart,
  FiList,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiGrid
} from 'react-icons/fi';

// You can replace this with your own logo image file
import logo from '../assets/Logo VS.webp'; // Place your logo in src/assets/logo.png

const SideMenu = () => {
  const role = localStorage.getItem('role');
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-60 h-screen bg-gray-800 text-white p-6 space-y-4">
      {/* Logo/Header */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={logo}
          alt="VapeShop Logo"
          className="w-20 h-20 rounded-full shadow-lg border-4 border-white object-cover mb-2"
        />
        <span className="text-2xl font-extrabold tracking-wide text-blue-200 drop-shadow">VapeSHOP</span>
      </div>

      <h2 className="text-xl font-bold mb-6">Menu</h2>

      {/* Admin-specific menu */}
      {role === 'admin' && (
        <>
          <Link
            to="/dashboard"
            className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isActive('/dashboard') ? 'bg-gray-700' : ''
            } flex items-center gap-2`}
          >
            <FiHome /> Admin Dashboard
          </Link>
             
          <Link
            to="/pos"
            className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isActive('/pos') ? 'bg-gray-700' : ''
            } flex items-center gap-2`}
          >
            <FiShoppingCart /> POS
          </Link>
          <Link
            to="/product-overview"
            className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isActive('/product-overview') ? 'bg-gray-700' : ''
            } flex items-center gap-2`}
          >
            <FiGrid /> Products
          </Link>
          <Link
            to="/purchase-history"
            className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isActive('/purchase history') ? 'bg-gray-700' : ''
            } flex items-center gap-2`}
          >
            <FiShoppingCart /> Purchase History
          </Link>
          {/* Removed Current Items link */}
          <Link
            to="/reports"
            className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isActive('/reports') ? 'bg-gray-700' : ''
            } flex items-center gap-2`}
          >
            <FiClipboard /> Reports
          </Link>
 
        </>
      )}

      {/* Cashier-specific menu */}
      {role === 'cashier' && (
        <>

          <Link
            to="/categories"
            className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isActive('/categories') ? 'bg-gray-700' : ''
            } flex items-center gap-2`}
          >
            <FiList /> Categories
          </Link>
          <Link
            to="/customer-management"
            className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isActive('/customer-management') ? 'bg-gray-700' : ''
            } flex items-center gap-2`}
          >
            <FiUsers /> Customer Management
          </Link>
          <Link
            to="/sales-report"
            className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${
              isActive('/sales-report') ? 'bg-gray-700' : ''
            } flex items-center gap-2`}
          >
            <FiBarChart2 /> Sales Report
          </Link>
        </>
      )}
    </aside>
  );
};

export default SideMenu;