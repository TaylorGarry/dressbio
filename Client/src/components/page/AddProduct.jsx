import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addProduct } from "../../redux/slices/productSlice.js";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const productData = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        available: data.available || false,
        deliverAt: data.deliverAt || null,
        image: data.image,  
      };

      await dispatch(addProduct(productData)).unwrap();
      toast.success("Product added successfully!");
      reset();
    } catch (err) {
      toast.error(err || "Failed to add product");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          {...register("name", { required: true })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          {...register("description", { required: true })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category"
          {...register("category", { required: true })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Cloudinary Image URL"
          {...register("image", { required: true })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          {...register("price", { required: true })}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          {...register("deliverAt")}
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register("available")} />
          <label>Available</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
