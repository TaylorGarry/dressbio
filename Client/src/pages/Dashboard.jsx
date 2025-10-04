import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}</h1>
      <p className="mb-4">This is the admin dashboard.</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
