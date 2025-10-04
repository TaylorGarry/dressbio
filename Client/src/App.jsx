import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./components/layout/AdminLayout";
import AddProduct from "./components/page/AddProduct";
import Page2 from "./components/page/Page2";
import Page3 from "./components/page/Page3";
import Page4 from "./components/page/Page4";
import Products from "./pages/Product";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/products" element={<Products />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="add-product" />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="product" element={<Page2 />} /> 
        <Route path="page3" element={<Page3 />} />
        <Route path="page4" element={<Page4 />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
