import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiSearch } from 'react-icons/fi';
import { HiEyeSlash } from "react-icons/hi2";
import SideMenu from '../layouts/SideMenu';
import Header from '../layouts/Header';
import API from '../api';

const ProductOverviewCashier = () => {
   const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: null
    });
    const [overviewProduct, setOverviewProduct] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [editCell, setEditCell] = useState({ row: null, col: null });
    const [editValue, setEditValue] = useState('');
    const [showHidden, setShowHidden] = useState(false);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price' },
        { key: 'stock', label: 'Stock' },
        { key: 'image', label: 'Image' },
        { key: 'actions', label: 'Actions' }
    ];

    const fetchProducts = async () => {
  try {
    const response = await API.get('/products');
    const visibleProducts = response.data.filter(product => 
      showHidden ? product.is_hidden : !product.is_hidden
    );
    setProducts(visibleProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setIsLoading(false);
  }
};

   useEffect(() => {
  fetchProducts();
}, [showHidden]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleHideProduct = async (id) => {
  try {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const updatedProduct = {
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      is_hidden: true, // toggle this to true
      credibility: product.credibility ?? null,
    };

    await API.put(`/products/${id}`, updatedProduct);

    // Optionally update the local state to hide product from view
    setProducts(products.filter((p) => p.id !== id));
  } catch (error) {
    console.error('Error hiding product:', error);
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
    formData.append('price', parseFloat(newProduct.price));
    formData.append('stock', parseInt(newProduct.stock));
    
    // Make sure image is appended correctly
    if (newProduct.image) {
        formData.append('image', newProduct.image);
    } else {
        alert('Please select an image');
        return;
    }

    try {
        const response = await API.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        // Refresh the product list
        fetchProducts();
        // Reset form
        setNewProduct({ name: '', category: '', price: '', stock: '', image: null });
        setIsModalOpen(false);
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
            await API.put(`/api/products/${updatedProduct.id}`, updatedProduct);
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
                    <div className="max-w-full mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Product Overview</h1>
                        <div className="flex gap-2">
                           <button
                                onClick={() => setShowHidden(!showHidden)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-not-allowed opacity-50"
                                disabled
                                >
                                <HiEyeSlash className="h-5 w-5" />
                                {showHidden ? 'Show Active Products' : 'Show Hidden Products'}
                                </button>

                                                            <button
                                disabled
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-not-allowed"
                                >
                                <FiPlus /> Add New Product
                                </button>

                        </div>
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
                                                    product.image_url ? (
                                                    <img
                                                        src={`http://localhost:8000/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded cursor-pointer"
                                                        onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                    ) : (
                                                    <span>No image</span>
                                                    )
                                                ) : col.key === 'actions' ? (
                                                    <div className="flex gap-2">
                                                  
                                                    <button
  disabled
  className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-not-allowed"
>
  <HiEyeSlash className="h-5 w-5" />
  
</button>

                                                    </div>
                                                ) : col.key === 'stock' ? (
                                                    <>
                                                    {product.stock === 0 ? (
                                                        <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-full">
                                                        Out of Stock
                                                        </span>
                                                    ) : product.stock <= 50 ? (
                                                        <span className="text-xs text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                                                        Low Stock ({product.stock})
                                                        </span>
                                                    ) : (
                                                        product.stock
                                                    )}
                                                    </>
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
                    <div
                        className="fixed inset-0"
                        style={{
                            background: 'rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(2px)',
                            cursor: 'pointer',
                        }}
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div
                        className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10"
                        onClick={(e) => e.stopPropagation()}
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
                                required
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                min="0"
                                step="0.01"
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                min="0"
                            />
                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-medium text-gray-700">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleAddProduct}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                disabled={!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock}
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

export default ProductOverviewCashier;