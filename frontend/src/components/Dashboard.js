
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductFormModal from './ProductFormModal';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setcurrentProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    console.log('Fetching products with token:', token);
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/products?page=${page}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleAddEditProduct = async (productData) => {
    const token = localStorage.getItem('token');
    const method = productData.id ? 'PUT' : 'POST';
    const url = productData.id
      ? `http://localhost:3001/api/products/${productData.id}`
      : 'http://localhost:3001/api/products';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error('Failed to save product');
      }
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const openAddModal = () => {
    setcurrentProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setcurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setcurrentProduct(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
        <div>
          <button
            onClick={openAddModal}
            className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600 mr-2 sm:px-4 sm:py-2 sm:text-base"
          >
            Add New Product
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 sm:px-4 sm:py-2 sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base">Date</th>
              <th className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base">Product</th>
              <th className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base">Color</th>
              <th className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base">Amount</th>
              <th className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base">Unit</th>
              <th className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base">Total</th>
              <th className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base text-center">{new Date(product.date).toLocaleDateString('en-CA')}</td>
                <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base text-center">{product.product_name}</td>
                <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base text-center">{product.color}</td>
                <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base text-center">{product.amount}</td>
                <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base text-center">{product.unit}</td>
                <td className="py-2 px-2 sm:px-4 border-b text-xs sm:text-base text-center">
                  {product.total}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => openEditModal(product)}
                    className="bg-blue-500 text-white px-1 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-1 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded disabled:opacity-50 mr-2 sm:px-4 sm:py-2 sm:text-base"
        >
          First Page
        </button>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
        >
          Next
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          className="bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded disabled:opacity-50 ml-2 sm:px-4 sm:py-2 sm:text-base"
        >
          Last Page
        </button>
      </div>
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={closeProductModal}
        onSave={handleAddEditProduct}
        initialData={currentProduct}
      />
    </div>
  );
};

export default Dashboard;
