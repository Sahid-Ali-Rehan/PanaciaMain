import React from 'react';

const CartModal = ({ closeModal }) => {
  const cartItems = [
    { name: 'Product 1', price: 29.99 },
    { name: 'Product 2', price: 19.99 },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
        <ul className="space-y-4">
          {cartItems.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="py-2 px-4 bg-gray-500 text-white rounded-md"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="py-2 px-4 bg-green-500 text-white rounded-md"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
