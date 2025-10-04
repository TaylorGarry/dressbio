import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signup } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(signup(data)).unwrap();
      toast.success("Signup successful!");
      if (result.user.accountType === "admin") navigate("/dashboard");
      else navigate("/products");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
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
        <select {...register("accountType")} className="w-full p-2 mb-4 border rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
