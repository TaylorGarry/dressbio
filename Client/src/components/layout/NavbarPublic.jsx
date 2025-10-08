import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, updateProfile } from "../../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ShoppingCart, Menu, X, Package, User } from "lucide-react";

const NavbarPublic = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
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

  const handleAuthClick = () => {
    if (location.pathname === "/login") navigate("/signup");
    else navigate("/login");
  };

  return (
    <>
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
            placeholder="Search Your designer dress..."
            className="border border-[#EAEAEA] p-2 rounded-full w-1/2 lg:w-1/3 max-w-xs focus:outline-none"
          />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="relative">
                <button
                  onClick={() => navigate("/cart")}
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer relative"
                >
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => navigate("/my-orders")}
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer flex items-center gap-1"
                >
                  <Package size={22} />
                  <span className="hidden lg:inline text-sm">My Orders</span>
                </button>
              </div>

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
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
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
          <div className="absolute top-14 left-0 w-full bg-white shadow-md p-4 flex flex-col gap-4 z-40 md:hidden">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/cart")}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                >
                  <ShoppingCart size={20} />
                  Cart ({cartItems.length})
                </button>
                <button
                  onClick={() => navigate("/my-orders")}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                >
                  <Package size={20} />
                  My Orders
                </button>
                <button
                  onClick={handleProfileOpen}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                >
                  <User size={20} />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthClick}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {location.pathname === "/login" ? "Sign Up" : "Sign In"}
              </button>
            )}
          </div>
        )}
      </nav>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">My Profile</h2>

            <form
              onSubmit={handleSubmit(async (data) => {
                try {
                  const formData = new FormData();
                  formData.append("username", data.username);
                  if (data.password) formData.append("password", data.password);
                  if (data.image?.[0]) formData.append("image", data.image[0]);
                  await dispatch(updateProfile(formData)).unwrap();
                  toast.success("Profile updated successfully!");
                  setIsProfileModalOpen(false);
                } catch (err) {
                  toast.error(err.message || "Failed to update profile");
                }
              })}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  {...register("username")}
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••"
                  className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full"
                />
                {watchImage && watchImage.length > 0 && (
                  <img
                    src={URL.createObjectURL(watchImage[0])}
                    alt="Preview"
                    className="w-20 h-20 rounded-full mt-3 object-cover border"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarPublic;
