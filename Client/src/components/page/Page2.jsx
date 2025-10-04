import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct } from "../../redux/slices/productSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Page2 = () => {
  const dispatch = useDispatch();
  const { list, loading, totalPages } = useSelector((state) => state.products);

  const [page, setPage] = useState(1);
  const containerRef = useRef();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchProducts({ page }))
      .unwrap()
      .catch((err) => toast.error(err));
  }, [dispatch, page]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    reset({
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      price: product.price,
      available: product.available,
    });
    setIsEditOpen(true);
  };

  const handleDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(selectedProduct._id))
      .unwrap()
      .then(() => toast.success("Product deleted"))
      .catch((err) => toast.error(err))
      .finally(() => {
        setIsDeleteOpen(false);
        setSelectedProduct(null);
      });
  };

  const onSubmit = (data) => {
    dispatch(updateProduct({ id: selectedProduct._id, updatedData: data }))
      .unwrap()
      .then(() => {
        toast.success("Product updated successfully");
        setIsEditOpen(false);
        setSelectedProduct(null);
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-auto h-full p-4"
    >
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      {list.length === 0 && <p>No products found.</p>}

      <div className="flex flex-col gap-2">
        {list.map((prod) => (
          <div
            key={prod._id}
            className="flex items-center justify-between border-b py-2 px-2 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{prod.name}</p>
                <p className="text-sm text-gray-500">
                  {prod.category} | ₹{prod.price}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(prod)}
                className="text-blue-600 text-sm border px-2 py-1 rounded hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteModal(prod)}
                className="text-red-600 text-sm border px-2 py-1 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading...</p>}

      {isEditOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <input {...register("name")} placeholder="Name" className="border p-2 rounded" />
              <input {...register("description")} placeholder="Description" className="border p-2 rounded" />
              <input {...register("category")} placeholder="Category" className="border p-2 rounded" />
              <input {...register("image")} placeholder="Image URL" className="border p-2 rounded" />
              <input {...register("price")} type="number" placeholder="Price" className="border p-2 rounded" />
              <select {...register("available")} className="border p-2 rounded">
                <option value={true}>Available</option>
                <option value={false}>Not Available</option>
              </select>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete "{selectedProduct?.name}"?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page2;
