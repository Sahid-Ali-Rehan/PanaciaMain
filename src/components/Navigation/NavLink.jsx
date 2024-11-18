import React from "react";

const NavLink = ({ label, onMouseEnter, onMouseLeave }) => {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="text-gray-800 hover:text-black text-sm font-medium transition-colors"
    >
      {label}
    </button>
  );
};

export default NavLink;
