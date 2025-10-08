import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct, addProductDetails } from "../../redux/slices/productSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Page2 = () => {
  const dispatch = useDispatch();
  const { list, loading, totalPages } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const containerRef = useRef();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [detailForm, setDetailForm] = useState({
    specifications: "",
    returnPolicy: "",
    expectedDelivery: "",
    reviews: "",
    extraImages: [],
  });
  const { register, handleSubmit, reset, watch } = useForm();

  useEffect(() => {
    if(list.length === 0){
    dispatch(fetchProducts({ page }))
      .unwrap()
      .catch((err) =>
        toast.error(err || "Failed to fetch products", {
          position: "top-center",
          style: { background: "#E74C3C", color: "white", borderRadius: "10px" },
        })
      );
    }
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
      price: product.price,
      available: product.available,
      deliverAt: product.deliverAt ? product.deliverAt.split("T")[0] : "",
    });
    setImagePreviews(product.images || []);
    setIsEditOpen(true);
  };

  const handleDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(selectedProduct._id))
      .unwrap()
      .then(() =>
        toast.success("Product deleted", {
          position: "top-center",
          style: { background: "#4BB543", color: "white", borderRadius: "10px" },
        })
      )
      .catch((err) =>
        toast.error(err || "Delete failed", {
          position: "top-center",
          style: { background: "#E74C3C", color: "white", borderRadius: "10px" },
        })
      )
      .finally(() => {
        setIsDeleteOpen(false);
        setSelectedProduct(null);
      });
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "images") return;
        if (key === "deliverAt" && value) {
          formData.append("deliverAt", new Date(value).toISOString());
        } else if (value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });
      if (data.images && data.images.length > 0) {
        for (let img of data.images) {
          formData.append("images", img);
        }
      }
      await dispatch(
        updateProduct({ id: selectedProduct._id, updatedData: Object.fromEntries(formData.entries()) })
      ).unwrap();
      toast.success("Product updated successfully", {
        position: "top-center",
        style: { background: "#4BB543", color: "white", borderRadius: "10px" },
      });
      setIsEditOpen(false);
      setSelectedProduct(null);
      setImagePreviews([]);
    } catch (err) {
      toast.error(err?.message || "Update failed", {
        position: "top-center",
        style: { background: "#E74C3C", color: "white", borderRadius: "10px" },
      });
    }
  };

  const handleAddDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleDetailImageChange = (e) => {
    setDetailForm({
      ...detailForm,
      extraImages: Array.from(e.target.files),
    });
  };

  const submitDetails = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("specifications", detailForm.specifications || "");
    formData.append("returnPolicy", detailForm.returnPolicy || "");
    formData.append("expectedDelivery", detailForm.expectedDelivery || "");
    if (detailForm.extraImages.length > 0) {
      detailForm.extraImages.forEach((file) => formData.append("extraImages", file));
    }
    if (detailForm.reviews) {
      formData.append("reviews", detailForm.reviews);
    }
    try {
      await dispatch(
        addProductDetails({
          id: selectedProduct._id,
          detailsData: formData,
        })
      ).unwrap();
      toast.success("Details added successfully!", { position: "top-center" });
      setIsDetailOpen(false);
      setDetailForm({
        specifications: "",
        returnPolicy: "",
        expectedDelivery: "",
        reviews: "",
        extraImages: [],
      });
    } catch (err) {
      toast.error(err?.message || "Failed to add details", { position: "top-center" });
    }
  };

  const watchImages = watch("images");
  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const previews = Array.from(watchImages).map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  }, [watchImages]);

  return (
    <div ref={containerRef} onScroll={handleScroll} className="overflow-auto h-full sm:p-6 cursor-pointer">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">All Products</h1>
      {list.length === 0 && <p className="text-center text-gray-500">No products found.</p>}
      <div className="flex flex-col gap-2">
        {list.map((prod) => (
          <div
            key={prod._id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-3 px-3 hover:bg-gray-100 transition rounded-md"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <img
                src={
                  prod.images && prod.images.length > 0
                    ? prod.images[0]
                    : prod.image
                    ? prod.image
                    : "/placeholder.jpg"
                }
                alt={prod.name}
                className="w-16 h-16 sm:w-12 sm:h-12 object-cover rounded border cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-semibold text-base sm:text-lg">{prod.name}</p>
                <p className="text-sm text-gray-500">
                  {prod.category} | ₹{prod.price}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => handleEdit(prod)}
                className="text-blue-600 text-sm border px-3 py-1 rounded hover:bg-blue-50 transition cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteModal(prod)}
                className="text-red-600 text-sm border px-3 py-1 rounded hover:bg-red-50 transition cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => handleAddDetail(prod)}
                className="text-green-600 text-sm border px-3 py-1 rounded hover:bg-green-50 transition cursor-pointer"
              >
                Add Detail
              </button>
            </div>
          </div>
        ))}
      </div>
      {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}
      {isEditOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50 cursor-pointer">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-96">
            <h2 className="text-xl font-bold mb-4 text-center sm:text-left">Edit Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <input {...register("name")} placeholder="Name" className="border p-2 rounded cursor-pointer" />
              <input {...register("description")} placeholder="Description" className="border p-2 rounded cursor-pointer" />
              <input {...register("category")} placeholder="Category" className="border p-2 rounded cursor-pointer" />
              <input {...register("price")} type="number" placeholder="Price" className="border p-2 rounded cursor-pointer" />
              <input type="date" {...register("deliverAt")} className="border p-2 rounded cursor-pointer" />
              <select {...register("available")} className="border p-2 rounded cursor-pointer">
                <option value={true}>Available</option>
                <option value={false}>Not Available</option>
              </select>
              <input type="file" multiple {...register("images")} className="border p-2 rounded cursor-pointer" />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                  {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="Preview" className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded border cursor-pointer" />
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50 cursor-pointer">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-80">
            <h2 className="text-lg font-bold mb-4 text-center sm:text-left">Confirm Delete</h2>
            <p className="mb-4 text-center sm:text-left">Are you sure you want to delete "{selectedProduct?.name}"?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100 transition cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isDetailOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50 cursor-pointer">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Add Product Details</h2>
            <form onSubmit={submitDetails} className="flex flex-col gap-3">
              <textarea
                placeholder="Specifications"
                value={detailForm.specifications}
                onChange={(e) => setDetailForm({ ...detailForm, specifications: e.target.value })}
                className="border p-2 rounded cursor-pointer"
              />
              <textarea
                placeholder="Return Policy"
                value={detailForm.returnPolicy}
                onChange={(e) => setDetailForm({ ...detailForm, returnPolicy: e.target.value })}
                className="border p-2 rounded cursor-pointer"
              />
              <input
                type="text"
                placeholder="Expected Delivery"
                value={detailForm.expectedDelivery}
                onChange={(e) => setDetailForm({ ...detailForm, expectedDelivery: e.target.value })}
                className="border p-2 rounded cursor-pointer"
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleDetailImageChange}
                className="border p-2 rounded cursor-pointer"
              />
              <textarea
                placeholder="Reviews (JSON format)"
                value={detailForm.reviews}
                onChange={(e) => setDetailForm({ ...detailForm, reviews: e.target.value })}
                className="border p-2 rounded cursor-pointer"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setIsDetailOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page2;
