import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Store } from 'lucide-react';
import SideMenu from './SideMenu';
import Header from './Header';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Example mock products data
    const exampleProducts = [
        { id: 1, name: 'Vape Pen', price: 25.99, stock: 50, category: 'Vape Pens' },
        { id: 2, name: 'Nicotine Salt', price: 15.99, stock: 5, category: 'E-liquids' },
        { id: 3, name: 'Vape Coil', price: 10.49, stock: 15, category: 'Vape Accessories' },
        { id: 4, name: 'Vape Tank', price: 35.99, stock: 20, category: 'Vape Tanks' },
        { id: 5, name: 'Disposable Vape', price: 12.99, stock: 8, category: 'Disposables' },
        { id: 6, name: 'E-Liquid 50ml', price: 18.99, stock: 30, category: 'E-liquids' },
        { id: 7, name: 'Vape Mod', price: 45.99, stock: 10, category: 'Vape Mods' }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Mock API call replaced by local data
                setProducts(exampleProducts);
                setError(null);
            } catch (err) {
                console.error('API Error:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const lowStock = products.filter(product => product.stock < 15);
    const stockSummary = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + product.stock;
        return acc;
    }, {});

    const stockData = Object.keys(stockSummary).map(category => ({
        name: category,
        value: stockSummary[category]
    }));

    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const totalProducts = products.length;

    // Improved color scheme
    const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#3F51B5', '#00BCD4'];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Fixed SideMenu */}
            <aside className="w-60 h-screen bg-gray-800 text-white fixed top-0 left-0 z-30 overflow-y-auto">
                <SideMenu />
            </aside>
            {/* Main Content with left margin */}
            <div className="flex-1 ml-60 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex items-center gap-4 mb-8">
                            <Store className="w-20 h-20 p-2 rounded-full border-2 border-white shadow-sm bg-white" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Vape Shop Admin Dashboard</h1>
                                <p className="text-gray-600">Track your shop's performance and inventory status</p>
                            </div>
                        </div>

                        {error && <p className="text-red-600">Error: {error}</p>}

                        {/* Stock Overview Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-2">Total Products</h2>
                                <p className="text-4xl font-bold text-blue-600">{totalProducts}</p>
                                <p className="text-gray-600">Number of unique products in inventory</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-2">Total Stock</h2>
                                <p className="text-4xl font-bold text-green-600">{totalStock}</p>
                                <p className="text-gray-600">Total quantity of all products</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-2">Low Stock Products</h2>
                                <p className="text-4xl font-bold text-red-600">{lowStock.length}</p>
                                <p className="text-gray-600">Products with stock below 15</p>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Stock Overview</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={products} barSize={30}>
                                            <XAxis dataKey="name" />
                                            <YAxis
                                                domain={[0, 150]}
                                                ticks={[0, 15, 25, 35, 45, 55, 65, 75, 85, 95, 115, 125, 135, 145, 150]}
                                            />
                                            <Tooltip />
                                            <Bar
                                                dataKey="stock"
                                                fill="#4CAF50"
                                                name="Stock"
                                                label={{ position: 'top', fill: '#000', fontSize: 12 }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Product Names</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {products.map(product => (
                                            <li
                                                key={product.id}
                                                className={`flex justify-between ${
                                                    product.stock < 15 ? 'text-red-500' : ''
                                                }`}
                                            >
                                                <span>{product.name}</span>
                                                <span className="text-gray-500">Stock: {product.stock}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Stock by Category</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="120%">
                                        <PieChart>
                                            <Pie
                                                data={stockData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label={({ name, value }) => `${name}: ${value}`}
                                                dataKey="value"
                                                isAnimationActive={true}
                                            >
                                                {stockData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Alerts Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 text-red-500">⚠️ Low Stock Alerts</h2>
                            {isLoading ? (
                                <p className="text-gray-500">Loading...</p>
                            ) : lowStock.length === 0 ? (
                                <p className="text-green-600">All products have sufficient stock ✅</p>
                            ) : (
                                <ul className="space-y-3">
                                    {lowStock.map(product => (
                                        <li key={product.id} className="flex justify-between items-center border-b pb-2">
                                            <div>
                                                <h3 className="font-medium text-gray-800">{product.name}</h3>
                                                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                                            </div>
                                            <span className="text-red-500 font-semibold">Low Stock</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;