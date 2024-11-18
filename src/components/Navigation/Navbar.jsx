import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineMenu } from "react-icons/ai";
import MobileMenu from "./MobileMenu";
import SearchModal from "../Modals/SearchModal";
import CartModal from "../Modals/CartModal";
import Dropdown from "./Dropdown";

// Categories for easier updates
const categories = [
  { name: "Men's Clothing", subcategories: ["T-shirts", "Jeans", "Jackets", "Shoes"] },
  { name: "Women's Clothing", subcategories: ["Dresses", "Tops", "Skirts", "Shoes"] },
  { name: "Accessories", subcategories: ["Watches", "Bags", "Belts", "Sunglasses"] },
  { name: "Sale", subcategories: ["Clearance", "Discounted Items"] },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleSearchModal = () => setSearchOpen(!searchOpen);
  const toggleCartModal = () => setCartOpen(!cartOpen);

  // Handle mouse enter and leave for dropdown
  const handleButtonMouseEnter = (item) => {
    setActiveButton(item);
    setDropdownOpen(true);
  };

  const handleButtonMouseLeave = () => {
    if (!dropdownOpen) setDropdownOpen(false);
  };

  const handleDropdownMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between py-4">
        {/* Logo */}
        <a href="/" className="text-black text-xl font-semibold">
          <img
            src="/Images/Logo.png"
            alt="Logo"
            className="h-10"
          />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#"
              onMouseEnter={() => handleButtonMouseEnter(category.name)}
              onMouseLeave={handleButtonMouseLeave}
              className="text-lg font-medium text-gray-800 hover:text-black cursor-pointer"
            >
              {category.name}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <AiOutlineSearch size={20} className="cursor-pointer hover:text-gray-600" onClick={toggleSearchModal} />
          <AiOutlineShoppingCart size={20} className="cursor-pointer hover:text-gray-600" onClick={toggleCartModal} />
          <AiOutlineMenu
            size={20}
            className="cursor-pointer hover:text-gray-600 md:hidden"
            onClick={toggleMobileMenu}
          />
        </div>
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <Dropdown
          activeButton={activeButton}
          handleDropdownMouseEnter={handleDropdownMouseEnter}
          handleDropdownMouseLeave={handleDropdownMouseLeave}
        />
      )}

      {/* Modals */}
      {searchOpen && <SearchModal closeModal={toggleSearchModal} />}
      {cartOpen && <CartModal closeModal={toggleCartModal} />}

      {/* Mobile Menu */}
      {mobileMenuOpen && <MobileMenu toggleMobileMenu={toggleMobileMenu} />}
    </header>
  );
};

export default Navbar;
