import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

const onSubmit = async (data) => {
  try {
    const result = await dispatch(login(data)).unwrap();
    toast.success("Login successful!");

    if (result.user.accountType === "admin") {
      navigate("/admin/add-product");
    } else {
      navigate("/products");
    }
  } catch (err) {
    toast.error(err);
  }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          {...register("username")}
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
