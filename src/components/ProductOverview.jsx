import { useState, useEffect } from 'react';
import { FiTrash, FiPlus, FiX, FiEye } from 'react-icons/fi';
import SideMenu from '../layouts/SideMenu';
import Header from '../layouts/Header';
import API from '../api';

const ProductOverview = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: ''
    });
    const [overviewProduct, setOverviewProduct] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [editCell, setEditCell] = useState({ row: null, col: null });
    const [editValue, setEditValue] = useState('');

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price' },
        { key: 'stock', label: 'Stock' },
        { key: 'image', label: 'Image' },
        { key: 'features', label: 'Features' },
        { key: 'actions', label: 'Actions' }
    ];

    const fetchProducts = async () => {
        try {
            const response = await API.get('http://localhost:8000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`http://localhost:8000/api/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleOverview = (product) => {
        setOverviewProduct(product);
    };

    const handleImageClick = () => {
        setIsImageModalOpen(true);
    };

   const handleAddProduct = async () => {
  const formData = new FormData();
  formData.append('name', newProduct.name);
  formData.append('category', newProduct.category);
  formData.append('price', newProduct.price);
  formData.append('stock', newProduct.stock);
  if (newProduct.image) {
    formData.append('image', newProduct.image);
  }

  try {
    await API.post('http://localhost:8000/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setNewProduct({ name: '', category: '', price: '', stock: '', image: '' });
    setIsModalOpen(false);
    fetchProducts();
  } catch (error) {
    console.error('Error adding product:', error);
  }
};


    const handleCellDoubleClick = (rowIdx, colKey) => {
        if (colKey === 'id' || colKey === 'image') return;
        setEditCell({ row: rowIdx, col: colKey });
        setEditValue(products[rowIdx][colKey]);
    };

    const handleCellChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleCellBlur = async (rowIdx, colKey) => {
        const updatedProduct = { ...products[rowIdx] };
        updatedProduct[colKey] = editValue;
        try {
            await API.put(`http://localhost:8000/api/products/${updatedProduct.id}`, updatedProduct);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }
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
            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">Product Overview</h1>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 shadow-md"
                            >
                                <FiPlus /> Add New Product
                            </button>
                        </div>
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
                                                                src={product.image ? `http://localhost:8000/storage/${product.image}` : '/placeholder.jpg'}
                                                                alt={product.name}
                                                                className="w-12 h-12 object-cover rounded cursor-pointer"
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
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Blurred Background with onClick to close */}
                    <div
                        className="fixed inset-0"
                        style={{
                            background: 'rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(2px)',
                            cursor: 'pointer',
                        }}
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    {/* Modal Content */}
                    <div
                        className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
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
  type="file"
  accept="image/*"
  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
/>

                        </div>
                        <div className="flex justify-end mt-6">
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
        </div>
    );
};

export default ProductOverview;
