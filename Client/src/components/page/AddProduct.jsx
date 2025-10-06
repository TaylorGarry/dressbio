// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import toast from "react-hot-toast";
// import { addProduct } from "../../redux/slices/productSlice.js";

// const AddProduct = () => {
//   const dispatch = useDispatch();
//   const { register, handleSubmit, reset } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       const productData = {
//         name: data.name,
//         description: data.description,
//         category: data.category,
//         price: Number(data.price),
//         available: data.available || false,
//         deliverAt: data.deliverAt || null,
//         image: data.image,  
//       };

//       await dispatch(addProduct(productData)).unwrap();
//       toast.success("Product added successfully!");
//       reset();
//     } catch (err) {
//       toast.error(err || "Failed to add product");
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Add New Product</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Product Name"
//           {...register("name", { required: true })}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           placeholder="Description"
//           {...register("description", { required: true })}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           placeholder="Category"
//           {...register("category", { required: true })}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="text"
//           placeholder="Cloudinary Image URL"
//           {...register("image", { required: true })}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="number"
//           placeholder="Price"
//           {...register("price", { required: true })}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="date"
//           {...register("deliverAt")}
//           className="w-full p-2 border rounded"
//         />
//         <div className="flex items-center space-x-2">
//           <input type="checkbox" {...register("available")} />
//           <label>Available</label>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           Add Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { addProduct } from "../../redux/slices/productSlice.js";
import { X, ZoomIn } from "lucide-react";

const AddProduct = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleImagePreview = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedFiles = [...selectedFiles];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setPreviewImages(updatedPreviews);
    setSelectedFiles(updatedFiles);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedFiles.length === 0) {
        toast.error("Please upload at least one product image", {
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontSize: "15px",
          },
        });
        return;
      }

      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        category: data.category.trim(),
        price: Number(data.price),
        available: data.available || false,
        deliverAt: data.deliverAt || null,
        images: selectedFiles,
      };

      await dispatch(addProduct(productData)).unwrap();

      toast.success("Product added successfully!", {
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#4BB543",
          color: "white",
          fontWeight: "500",
          fontSize: "15px",
        },
      });

      reset();
      setPreviewImages([]);
      setSelectedFiles([]);
    } catch (err) {
      toast.error(err?.message || "Failed to add product", {
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#E74C3C",
          color: "white",
          fontWeight: "500",
          fontSize: "15px",
        },
      });
    }
  };

  return (
   <div className="p-6 sm:p-8 w-full max-w-lg mx-auto bg-white shadow-xl rounded-2xl">
  <h2 className="text-2xl sm:text-3xl font-semibold mb-5 text-center text-gray-800">
    Add Your Product Here
  </h2>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    <div>
      <input
        type="text"
        placeholder="Product Name"
        {...register("name", {
          required: "Product name is required",
          minLength: { value: 3, message: "Minimum 3 characters required" },
        })}
        className="w-full p-3 border rounded focus:outline-blue-500 cursor-pointer"
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
      )}
    </div>

    <div>
      <textarea
        placeholder="Description"
        {...register("description", {
          required: "Description is required",
          minLength: { value: 10, message: "Minimum 10 characters required" },
        })}
        className="w-full p-3 border rounded focus:outline-blue-500 cursor-pointer"
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-1">
          {errors.description.message}
        </p>
      )}
    </div>

    <div>
      <input
        type="text"
        placeholder="Category"
        {...register("category", { required: "Category is required" })}
        className="w-full p-3 border rounded focus:outline-blue-500 cursor-pointer"
      />
      {errors.category && (
        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
      )}
    </div>

    <div>
      <input
        type="number"
        placeholder="Price"
        {...register("price", {
          required: "Price is required",
          min: { value: 1, message: "Price must be greater than 0" },
        })}
        className="w-full p-3 border rounded focus:outline-blue-500 cursor-pointer"
      />
      {errors.price && (
        <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
      )}
    </div>

    <div>
      <input
        type="date"
        {...register("deliverAt")}
        className="w-full p-3 border rounded focus:outline-blue-500 cursor-pointer"
      />
    </div>

    <div className="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" {...register("available")} className="cursor-pointer" />
      <label className="cursor-pointer">Available</label>
    </div>

    <div>
      <label className="block mb-1 font-medium cursor-pointer">Product Images</label>
      <input
        type="file"
        {...register("images")}
        multiple
        accept="image/*"
        onChange={handleImagePreview}
        className="w-full p-3 border rounded focus:outline-blue-500 cursor-pointer"
      />
      {previewImages.length === 0 && (
        <p className="text-gray-500 text-sm mt-1 text-center sm:text-left">
          You can upload multiple images (JPG, PNG, WebP)
        </p>
      )}

      {previewImages.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previewImages.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.previewUrl}
                alt={`Preview ${index}`}
                className="w-full h-24 sm:h-28 object-cover rounded-md border cursor-pointer"
                onClick={() => setEnlargedImage(img.previewUrl)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <ZoomIn size={18} className="text-white" />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white font-medium p-3 rounded hover:bg-blue-700 transition cursor-pointer"
    >
      Add Product
    </button>
  </form>

  {enlargedImage && (
    <div
      onClick={() => setEnlargedImage(null)}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-zoom-out"
    >
      <div className="relative max-w-3xl w-full p-4">
        <img
          src={enlargedImage}
          alt="Enlarged"
          className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
        <button
          onClick={() => setEnlargedImage(null)}
          className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded-full cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default AddProduct;
