import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfile } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { username: user?.username || "", password: "", image: null },
  });
  const watchImage = watch("image");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileOpen = () => {
    setIsProfileModalOpen(true);
    setShowProfileMenu(false);
    reset({ username: user.username, password: "", image: null });
  };

  const handleProfileSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      if (data.password) formData.append("password", data.password);
      if (data.image && data.image[0]) formData.append("image", data.image[0]);
      const result = await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      reset({ username: result.username, password: "", image: null });
      setIsProfileModalOpen(false);
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-white shadow-md sticky top-0 z-50 px-6 py-3 flex justify-end items-center">
      
      <div className="relative">
        {user?.image ? (
          <img
            src={user.image}
            alt="profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-200 hover:scale-105 transition-transform"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
        ) : (
          <div
            className="w-10 h-10 bg-blue-200 rounded-full cursor-pointer flex items-center justify-center text-white font-semibold hover:scale-105 transition-transform"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={() => { setIsProfileModalOpen(true); setShowProfileMenu(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
            >
              My Profile
            </button>
          </div>
        )}
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Update Profile</h2>
            <form
              onSubmit={handleProfileSubmit}
              className="flex flex-col gap-3"
              encType="multipart/form-data"
            >
              <input {...register("username")} placeholder="Username" className="border p-2 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none" />
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="border p-2 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none"
              />
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                className="border p-2 rounded-lg"
              />

              {watchImage && watchImage[0] && (
                <img
                  src={URL.createObjectURL(watchImage[0])}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg mt-2"
                />
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
