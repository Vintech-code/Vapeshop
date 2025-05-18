import { useState, useEffect } from 'react';
import { FiTrash, FiPlus, FiX, FiEye } from 'react-icons/fi';
import SideMenu from './SideMenu';
import Header from './Header';

const ProductOverview = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', image: '' });
    const [overviewProduct, setOverviewProduct] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // Example products for testing
        const exampleProducts = [
            { id: 1, name: "Vape Pen", price: 649.50, stock: 10, category: "Vape", image: '/img/Vape Pen3.jpg', features: ["Portable", "Durable"], credibility: "Top Seller" },
            { id: 2, name: "Nicotine Juice", price: 274.50, stock: 15, category: "Liquids", image: '/img/Nicotine juice.jpg', features: ["Smooth Flavor", "Premium Quality"], credibility: "Customer Favorite" },
            { id: 3, name: "Vape Battery", price: 649.50, stock: 7, category: "Accessories", image: '/img/Battery1.webp', features: ["Long-lasting", "Rechargeable"], credibility: "Highly Rated" },
            { id: 4, name: "Vape Pod", price: 499.50, stock: 5, category: "Vape", image: '/img/Vape Pods.webp', features: ["Compact Design", "Easy to Use"], credibility: "Best Value" },
            { id: 5, name: "Vape Juice", price: 199.99, stock: 20, category: "Liquids", image: '/img/Vape Juice.jpg', features: ["Rich Taste", "Affordable"], credibility: "Popular Choice" },
            { id: 6, name: "Vape Charger", price: 150.00, stock: 12, category: "Accessories", image: '/img/Vape Charger.jpg', features: ["Fast Charging", "Safe"], credibility: "Reliable" },
            { id: 7, name: "Vape Tank", price: 350.00, stock: 8, category: "Vape", image: '/img/Vape Tank.jpg', features: ["Large Capacity", "Easy Refill"], credibility: "Best Seller" },
            { id: 8, name: "Vape Cotton", price: 50.00, stock: 30, category: "Accessories", image: '/img/Vape Cotton.jpg', features: ["Organic", "Long Lasting"], credibility: "Highly Rated" },
        ];
        setProducts(exampleProducts);
        setIsLoading(false);
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(product => product.id !== id));
        }
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock || !newProduct.image) {
            alert('Please fill in all fields.');
            return;
        }

        const newId = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
        const productToAdd = { ...newProduct, id: newId, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock, 10), features: [], credibility: "" };
        setProducts([...products, productToAdd]);
        setNewProduct({ name: '', category: '', price: '', stock: '', image: '' });
        setIsModalOpen(false);
    };

    const handleOverview = (product) => {
        setOverviewProduct(product);
    };

    const handleImageClick = () => {
        setIsImageModalOpen(true);
    };

    // Excel-like cell editing
    const [editCell, setEditCell] = useState({ row: null, col: null });
    const [editValue, setEditValue] = useState('');

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price' },
        { key: 'stock', label: 'Stock' },
        { key: 'credibility', label: 'Credibility' },
        { key: 'features', label: 'Features' },
        { key: 'image', label: 'Image' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleCellDoubleClick = (rowIdx, colKey) => {
        if (colKey === 'actions' || colKey === 'image' || colKey === 'id') return;
        setEditCell({ row: rowIdx, col: colKey });
        setEditValue(products[rowIdx][colKey]);
    };

    const handleCellChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleCellBlur = (rowIdx, colKey) => {
        const updatedProducts = [...products];
        updatedProducts[rowIdx][colKey] = colKey === 'price' ? parseFloat(editValue) :
                                          colKey === 'stock' ? parseInt(editValue, 10) :
                                          editValue;
        setProducts(updatedProducts);
        setEditCell({ row: null, col: null });
    };

    const handleCellKeyDown = (e, rowIdx, colKey) => {
        if (e.key === 'Enter') {
            handleCellBlur(rowIdx, colKey);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Fixed SideMenu */}
            <div className="h-screen w-64 fixed top-0 left-0 z-30 bg-white border-r shadow-lg">
                <SideMenu />
            </div>

            {/* Main Content with left margin for fixed SideMenu */}
            <div className="flex-1 flex flex-col ml-64">
                <Header />

                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">Product Overview </h1>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 shadow-md"
                            >
                                <FiPlus /> Add New Product
                            </button>
                        </div>

                        {/* Excel-like Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded shadow">
                                <thead>
                                    <tr>
                                        {columns.map(col => (
                                            <th key={col.key} className="px-4 py-2 border-b text-left bg-blue-100">{col.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center py-4 text-gray-500">Loading products...</td>
                                        </tr>
                                    ) : currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center py-4 text-gray-500">No products available.</td>
                                        </tr>
                                    ) : (
                                        currentItems.map((product, rowIdx) => (
                                            <tr key={product.id} className="hover:bg-blue-50">
                                                {columns.map(col => (
                                                    <td
                                                        key={col.key}
                                                        className="px-4 py-2 border-b"
                                                        onDoubleClick={() => handleCellDoubleClick(indexOfFirstItem + rowIdx, col.key)}
                                                    >
                                                        {editCell.row === indexOfFirstItem + rowIdx && editCell.col === col.key ? (
                                                            <input
                                                                type={col.key === 'price' || col.key === 'stock' ? 'number' : 'text'}
                                                                value={editValue}
                                                                autoFocus
                                                                onChange={handleCellChange}
                                                                onBlur={() => handleCellBlur(indexOfFirstItem + rowIdx, col.key)}
                                                                onKeyDown={e => handleCellKeyDown(e, indexOfFirstItem + rowIdx, col.key)}
                                                                className="border rounded px-2 py-1 w-full"
                                                            />
                                                        ) : col.key === 'image' ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-12 h-12 object-cover rounded cursor-pointer"
                                                                onClick={() => {
                                                                    setOverviewProduct(product);
                                                                    setIsImageModalOpen(true);
                                                                }}
                                                            />
                                                        ) : col.key === 'features' ? (
                                                            Array.isArray(product.features) ? product.features.join(', ') : product.features
                                                        ) : col.key === 'actions' ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleOverview(product)}
                                                                    className="text-green-500 hover:text-green-700 flex items-center gap-1"
                                                                    title="Overview Product"
                                                                >
                                                                    <FiEye /> Overview
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(product.id)}
                                                                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                                                    title="Delete Product"
                                                                >
                                                                    <FiTrash /> Delete
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            product[col.key]
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center mt-8 space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx + 1}
                                    onClick={() => setCurrentPage(idx + 1)}
                                    className={`px-4 py-2 rounded-lg ${currentPage === idx + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {isImageModalOpen && overviewProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 relative">
                        <button
                            onClick={() => setIsImageModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
                        >
                            <FiX size={24} />
                        </button>
                        <img
                            src={overviewProduct.image}
                            alt={overviewProduct.name}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                </div>
            )}

            {/* Overview Modal */}
            {overviewProduct && !isImageModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="fixed inset-0"
                        style={{
                            background: 'rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(2px)',
                            cursor: 'pointer'
                        }}
                        onClick={() => setOverviewProduct(null)}
                    ></div>
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full relative z-10">
                        <button
                            onClick={() => setOverviewProduct(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            aria-label="Close"
                        >
                            <FiX size={24} />
                        </button>
                        <img
                            src={overviewProduct.image}
                            alt={overviewProduct.name}
                            className="w-32 h-32 object-cover rounded-lg mb-4 mx-auto"
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer' }}
                        />
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">{overviewProduct.name}</h2>
                        <p className="mb-2 text-gray-700">
                            <strong>Category:</strong> {overviewProduct.category}
                        </p>
                        <p className="mb-2 text-gray-700">
                            <strong>Price:</strong> ₱{overviewProduct.price?.toFixed(2)}
                        </p>
                        <p className="mb-2 text-gray-700">
                            <strong>Stock:</strong> {overviewProduct.stock}
                        </p>
                        <p className="mb-2 text-gray-700">
                            <strong>Features:</strong> {Array.isArray(overviewProduct.features) ? overviewProduct.features.join(', ') : overviewProduct.features}
                        </p>
                        <p className="mb-2 text-gray-700">
                            <strong>Credibility:</strong> {overviewProduct.credibility}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductOverview;