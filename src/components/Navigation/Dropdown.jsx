import React from "react";

// Categories for easy customization, including custom sizes
const categories = {
  "Men's Clothing": [
    { img: "https://via.placeholder.com/500x500?text=Men+Shirt", name: "Shirt" },
    { img: "https://via.placeholder.com/500x500?text=Blue+Jeans", name: "Jeans" },
  ],
  "Women's Clothing": [
    { img: "https://kimurakami.com/cdn/shop/files/kimono-traditional-dress_1080x.jpg?v=1716524353", name: "Dress", size: { height: 250, width: 200 } },
    { img: "https://via.placeholder.com/500x500?text=Women+Tops", name: "Tops", },
    { img: "https://via.placeholder.com/500x500?text=Women+Tops", name: "Tops", },

  ],
  Accessories: [
    { img: "https://via.placeholder.com/500x500?text=Watches", name: "Watches" },
    { img: "https://via.placeholder.com/500x500?text=Bags", name: "Bags" },
  ],
  Sale: [
    { img: "https://via.placeholder.com/500x500?text=Discount+Item", name: "Discounted" },
  ],
};

const Dropdown = ({
  activeButton,
  handleDropdownMouseEnter,
  handleDropdownMouseLeave,
  defaultHeight = 200, // Default height if no custom size is provided
  defaultWidth = 200, // Default width if no custom size is provided
}) => {
  return (
    <div
      onMouseEnter={handleDropdownMouseEnter}
      onMouseLeave={handleDropdownMouseLeave}
      className="absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50"
    >
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Content */}
          <div>
            <h2 className="text-lg font-bold text-gray-800">Explore More</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              {categories[activeButton]?.map((product, idx) => (
                <li key={idx}>
                  <a href="#" className="block hover:text-blue-600">{product.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content with Product Images */}
          <div className="flex flex-wrap justify-between space-x-4">
            {categories[activeButton]?.map((product, idx) => {
              // Set custom sizes if available, else use default sizes
              const { height = defaultHeight, width = defaultWidth } = product.size || {};

              return (
                <div key={idx} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="object-cover rounded-lg transition-all"
                    style={{
                      height: `${height}px`, // Dynamic height
                      width: `${width}px`,   // Dynamic width
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
