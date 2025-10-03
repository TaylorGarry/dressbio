import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/signup.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProductHome from "./pages/Products/ProductHome.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/products/home" element={<ProductHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
