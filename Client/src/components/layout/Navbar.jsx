import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfile } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      username: user?.username || "",
      password: "",
      image: null,
    },
  });

  const watchImage = watch("image");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileOpen = () => {
    setIsProfileModalOpen(true);
    setShowProfileMenu(false);
    reset({
      username: user.username,
      password: "",
      image: null,
    });
  };

  const handleProfileSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      if (data.password) formData.append("password", data.password);
      if (data.image && data.image[0]) formData.append("image", data.image[0]);

      await dispatch(updateProfile({ formData, token })).unwrap();

      toast.success("Profile updated successfully");
      setIsProfileModalOpen(false);
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded w-1/3 max-w-xs"
      />

      <div className="relative">
        {user?.image ? (
          <img
            src={user.image}
            alt="profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
        ) : (
          <div
            className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer flex items-center justify-center text-white"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
            <button
              onClick={handleProfileOpen}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              My Profile
            </button>
          </div>
        )}
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            <form
              onSubmit={handleSubmit(handleProfileSubmit)}
              className="flex flex-col gap-3"
              encType="multipart/form-data"
            >
              <input
                {...register("username")}
                placeholder="Username"
                className="border p-2 rounded"
              />
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
              />
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                className="border p-2 rounded"
              />

              {watchImage && watchImage[0] && (
                <img
                  src={URL.createObjectURL(watchImage[0])}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded mt-2"
                />
              )}

              {user?.image ? (
  <img
    src={user.image}
    alt="profile"
    className="w-10 h-10 rounded-full cursor-pointer"
    onClick={() => setShowProfileMenu(!showProfileMenu)}
  />
) : (
  <div
    className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer flex items-center justify-center text-white"
    onClick={() => setShowProfileMenu(!showProfileMenu)}
  >
    {user?.username?.[0]?.toUpperCase() || "U"}
  </div>
)}



              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
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

export default Navbar;
