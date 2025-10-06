import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, updateProfile } from "../../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ShoppingCart, Menu, X } from "lucide-react";

const NavbarPublic = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
    setShowMenu(false);
    reset({
      username: user?.username || "",
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
      const result = await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      reset({
        username: result.username,
        password: "",
        image: null,
      });
      setIsProfileModalOpen(false);
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleAuthClick = () => {
    if (location.pathname === "/login") navigate("/signup");
    else navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-3 md:p-4 flex items-center justify-between w-full fixed top-0 left-0 z-50">
      <div
        onClick={() => navigate("/products")}
        className="text-xl md:text-2xl font-bold cursor-pointer select-none"
      >
        DressBio
      </div>

      <div className="hidden md:flex items-center justify-center flex-1">
        <input
          type="text"
          placeholder="Search Your designers dress..."
          className="border border-[#EAEAEA] p-2 rounded-full w-1/2 lg:w-1/3 max-w-xs focus:outline-none"
        />
      </div>

      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <ShoppingCart size={22} />
            </button>
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt="profile"
                  className="w-10 h-10 rounded-full cursor-pointer border"
                  onClick={() => setShowMenu(!showMenu)}
                />
              ) : (
                <div
                  className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer flex items-center justify-center text-white font-semibold"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50 ">
                  <button
                    onClick={handleProfileOpen}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={handleAuthClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            {location.pathname === "/login" ? "Sign Up" : "Sign In"}
          </button>
        )}
      </div>

      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded hover:bg-gray-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white border-t shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          <input
            type="text"
            placeholder="Search Your designers dress..."
            className="border border-[#EAEAEA] p-2 rounded-full w-11/12 focus:outline-none"
          />
          {user ? (
            <>
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded w-11/12 justify-center cursor-pointer"
              >
                <ShoppingCart size={20} /> Cart
              </button>
              <button
                onClick={handleProfileOpen}
                className="w-11/12 px-4 py-2 bg-gray-100 rounded cursor-pointer"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-11/12 px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleAuthClick}
              className="w-11/12 px-4 py-2 bg-blue-600 text-white rounded"
            >
              {location.pathname === "/login" ? "Sign Up" : "Sign In"}
            </button>
          )}
        </div>
      )}

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Update Profile</h2>
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
                  className="w-20 h-20 object-cover rounded mt-2 self-center"
                />
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
    </nav>
  );
};

export default NavbarPublic;
