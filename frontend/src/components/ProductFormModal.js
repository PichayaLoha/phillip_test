
import React, { useState, useEffect } from 'react';

const ProductFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [date, setDate] = useState(initialData ? initialData.date : '');
  const [product, setProduct] = useState(initialData ? initialData.product_name : '');
  const [amount, setAmount] = useState(initialData ? initialData.Amount : '');
  const [unit, setUnit] = useState(initialData ? initialData.unit : '');
  const [color, setColor] = useState(initialData ? initialData.color : '');
  const [error, setError] = useState('');

  const allowedProducts = [
    'Banana',
    'Cherry',
    'Apple',
    'Orange',
    'Watermelon',
    'Mango',
    'Grapes',
    'Strawberry',
    'Peach',
    'Pineapple',
  ];

  useEffect(() => {
    if (initialData) {
      setProduct(initialData.product_name);
      setAmount(initialData.amount);
      setUnit(initialData.unit);
      setColor(initialData.color);
      setDate(initialData.date);
    } else {
      setProduct('');
      setAmount('');
      setUnit('');
      setColor('');
      setDate('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!product || !amount || !unit || !color || !date) {
      setError('All fields are required.');
      return;
    }

    if (!allowedProducts.includes(product)) {
      setError(
        `Invalid product. Allowed products are: ${allowedProducts.join(', ')}.`
      );
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    if (isNaN(unit) || unit <= 0) {
      setError('Unit must be a positive number.');
      return;
    }

    onSave({
      id: initialData ? initialData.id : null,
      product_name: product,
      amount: amount,
      unit: unit,
      color: color,
      date: date,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-2">
              Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-xs sm:py-2 sm:px-3 sm:text-base leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-2">
              Product Name:
            </label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-xs sm:py-2 sm:px-3 sm:text-base leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a product</option>
              {allowedProducts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-2">
              Amount:
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-xs sm:py-2 sm:px-3 sm:text-base leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-2">
              Unit:
            </label>
            <input
              type="number"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-xs sm:py-2 sm:px-3 sm:text-base leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-2">
              Color:
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-xs sm:py-2 sm:px-3 sm:text-base leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded focus:outline-none focus:shadow-outline sm:py-2 sm:px-4 sm:text-base"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 text-xs rounded focus:outline-none focus:shadow-outline sm:py-2 sm:px-4 sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
