import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Add Product", path: "/admin/add-product" },
  { name: "All Products", path: "/admin/product" },
  { name: "Orders", path: "/admin/page3" },
  { name: "Status", path: "/admin/page4" },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`bg-gray-800 text-white h-screen p-4 fixed md:relative z-40 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path} className="mb-2">
            <NavLink
              to={item.path}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
