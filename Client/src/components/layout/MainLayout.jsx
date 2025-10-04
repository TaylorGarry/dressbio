import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
