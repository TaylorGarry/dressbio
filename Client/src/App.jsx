// No HashRouter here — just Routes
import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./components/layout/AdminLayout";
import AddProduct from "./components/page/AddProduct";
import Page2 from "./components/page/Page2";
import Page3 from "./components/page/Page3";
import Page4 from "./components/page/Page4";
import Products from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/CheckOut.jsx";
import MyOrders from "./pages/MyOrder.jsx";
import ProductDetail from "./components/page/ProductDetail.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" />} />
      <Route path="/products" element={<Products />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/admin/*"
        element={
          user && user.accountType === "admin" ? (
            <AdminLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="add-product" />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="product" element={<Page2 />} />
        <Route path="orders" element={<Page3 />} />
        <Route path="page4" element={<Page4 />} />
      </Route>
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="*" element={<Navigate to="/products" />} />
    </Routes>
  );
};

export default App;
