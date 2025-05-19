import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/components/Login';
import Dashboard from '../src/components/Dashboard';
import ProductManagement from './components/ProductManagement';
import ProductOverview from './components/ProductOverview';
import SalesManagement from './components/SalesManagement';
import SalesReport from './components/SalesReports';
import CustomerManagement from './components/CustomerManagement';
import CustomerName from './components/CustomerName';
import CurrentManagement from './components/CurrentManagement';
import InventoryManagement from './components/InventoryManagement';
import PurchaseHistory from './components/PurchaseHistory';
import Category from './components/Category';
import POS from './components/POS';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/product-overview" element={<ProductOverview />} />
        <Route path="/sales-management" element={<SalesManagement />} />
        <Route path="/sales-report" element={<SalesReport />} /> 
        <Route path="/customer-management" element={<CustomerManagement />} />
        <Route path="/customer-name" element={<CustomerName />} />
        <Route path="/current-management" element={<CurrentManagement />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/pos" element={<POS />} />
      </Routes>
    </Router>
  );
}

export default App;
