import React, { useState } from 'react';

const SearchModal = ({ closeModal }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Search query:', searchQuery);
    closeModal(); // Close modal after search
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Search Products</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products..."
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="py-2 px-4 bg-gray-500 text-white rounded-md"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
