import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { signup } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(signup(data)).unwrap();
      toast.success("Signup successful!");
      if (result.user.accountType === "admin") navigate("/dashboard");
      else navigate("/products");
    } catch (err) {
      toast.error(err || "Signup failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Username */}
        <input
          {...register("username", { required: "Username is required" })}
          placeholder="Username"
          className={`w-full p-2 mb-2 border rounded ${
            errors.username ? "border-red-500" : ""
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">
            {errors.username.message}
          </p>
        )}

        {/* Password */}
        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
          className={`w-full p-2 mb-2 border rounded ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </p>
        )}

        {/* Account Type */}
        <select
          {...register("accountType", { required: "Please select account type" })}
          className={`w-full p-2 mb-2 border rounded ${
            errors.accountType ? "border-red-500" : ""
          }`}
        >
          <option value="">Select Account Type</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.accountType && (
          <p className="text-red-500 text-sm mb-2">
            {errors.accountType.message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 rounded text-white transition ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Sign Up"}
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
