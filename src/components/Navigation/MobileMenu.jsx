import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const MobileMenu = ({ toggleMobileMenu }) => {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);

  const toggleStoreDropdown = () => setStoreDropdownOpen(!storeDropdownOpen);

  return (
    <div className="fixed inset-0 bg-white z-50 p-6 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Menu</h2>
        <AiOutlineClose size={28} className="cursor-pointer" onClick={toggleMobileMenu} />
      </div>
      <nav className="mt-4">
        <ul className="space-y-4">
          <li>
            <button
              onClick={toggleStoreDropdown}
              className="w-full text-left text-gray-800 hover:text-black text-lg font-medium flex items-center"
            >
              Store
            </button>
            {storeDropdownOpen && (
              <ul className="space-y-2 pl-4">
                <li><a href="/store/mac" className="text-gray-600 hover:text-black">Mac</a></li>
                <li><a href="/store/ipad" className="text-gray-600 hover:text-black">iPad</a></li>
                <li><a href="/store/iphone" className="text-gray-600 hover:text-black">iPhone</a></li>
                <li><a href="/store/watch" className="text-gray-600 hover:text-black">Watch</a></li>
              </ul>
            )}
          </li>
          <li>
            <a href="#mac" className="block text-gray-800 hover:text-black text-lg font-medium">Mac</a>
          </li>
          <li>
            <a href="#ipad" className="block text-gray-800 hover:text-black text-lg font-medium">iPad</a>
          </li>
          <li>
            <a href="#iphone" className="block text-gray-800 hover:text-black text-lg font-medium">iPhone</a>
          </li>
          <li>
            <a href="#watch" className="block text-gray-800 hover:text-black text-lg font-medium">Watch</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
