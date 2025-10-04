import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
