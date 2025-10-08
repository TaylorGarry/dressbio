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
    </nav>
  );
};

export default NavbarPublic;
