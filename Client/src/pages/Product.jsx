// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../redux/slices/productSlice";
// import { addToCart, removeFromCart } from "../redux/slices/cartSlice";
// import { Loader2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import NavbarPublic from "../components/layout/NavbarPublic";

// const Product = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { list, loading, page, hasMore, totalPages } = useSelector(
//     (state) => state.products
//   );
//   const { token } = useSelector((state) => state.auth);
//   const { items: cartItems } = useSelector((state) => state.cart);
//   const location = useLocation();

//   const searchResults = location.state?.searchResults || [];
//   const productList = searchResults.length > 0 ? searchResults : list;
//   console.log("Product List:", productList);

//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [animatingHearts, setAnimatingHearts] = useState({});

//   useEffect(() => {
//     if (list.length === 0) {
//       dispatch(fetchProducts({ page: 1 }));
//     }
//   }, [dispatch]);

//   const handleLoadMore = () => {
//     if (hasMore && !loading) {
//       dispatch(fetchProducts({ page: page + 1 }));
//     }
//   };

//   const handleBuy = (product) => {
//     if (!token) return alert("Please login to buy!");
//     navigate("/checkout", { state: { product } });
//     console.log("Buy product:", product);
//   };

//   const toggleLike = (product) => {
//     if (!token) return alert("Please login to like products!");
//     const isInCart = cartItems.some((item) => item._id === product._id);
//     if (isInCart) dispatch(removeFromCart(product._id));
//     else dispatch(addToCart(product));

//     setAnimatingHearts((prev) => ({ ...prev, [product._id]: true }));
//     setTimeout(() => {
//       setAnimatingHearts((prev) => ({ ...prev, [product._id]: false }));
//     }, 400);
//   };

//   const nextImage = (productId, total) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [productId]: ((prev[productId] || 0) + 1) % total,
//     }));
//   };

//   const prevImage = (productId, total) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [productId]:
//         (prev[productId] || 0) === 0 ? total - 1 : prev[productId] - 1,
//     }));
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       productList.forEach((product) => {
//         const total = product.images?.length || 0;
//         if (total > 1) {
//           setCurrentImageIndex((prev) => ({
//             ...prev,
//             [product._id]: ((prev[product._id] || 0) + 1) % total,
//           }));
//         }
//       });
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [productList]);

//   return (
//     <>
//       <style>
//         {`
//           @keyframes pop {
//             0% { transform: scale(1); }
//             50% { transform: scale(1.4); }
//             100% { transform: scale(1); }
//           }
//           .pop {
//             animation: pop 0.4s ease;
//           }
//         `}
//       </style>
//       <NavbarPublic />
//       <div className="min-h-screen bg-gray-100 mt-16 py-10 px-5">
//         <div className="max-w-7xl mx-auto">
//           {loading && productList.length === 0 ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
//             </div>
//           ) : productList.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-[70vh] text-center">
//               <img
//                 src="/images/no-data.png"
//                 alt="No data found"
//                 className="w-60 h-60 object-contain mb-6"
//               />
//               <h2 className="text-2xl font-semibold text-gray-700">
//                 No Products Found
//               </h2>
//               <p className="text-gray-500 mt-2">
//                 Try searching for another dress or designer
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//                 {productList.map((product) => {
//                   const images =
//                     Array.isArray(product.images) && product.images.length > 0
//                       ? product.images
//                       : ["https://via.placeholder.com/300x300?text=No+Image"];
//                   const index = currentImageIndex[product._id] || 0;
//                   const isInCart = cartItems.some(
//                     (item) => item._id === product._id
//                   );
//                   const animate = animatingHearts[product._id];

//                   return (
//                     <div
//                       key={product._id}
//                       className="relative bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center"
//                     >
//                       <div className="relative w-40 h-40 mb-3 overflow-hidden rounded-md">
//                         <img
//                           src={images[index]}
//                           alt={product.name}
//                           className="w-40 h-40 object-cover rounded-md transition-transform duration-700 ease-in-out"
//                         />
//                         {images.length > 1 && (
//                           <>
//                             <button
//                               onClick={() =>
//                                 prevImage(product._id, images.length)
//                               }
//                               className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-1 rounded-full hover:bg-white cursor-pointer"
//                             >
//                               <ChevronLeft className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 nextImage(product._id, images.length)
//                               }
//                               className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-1 rounded-full hover:bg-white cursor-pointer"
//                             >
//                               <ChevronRight className="w-4 h-4" />
//                             </button>
//                           </>
//                         )}
//                       </div>

//                       <button
//                         onClick={() => toggleLike(product)}
//                         className={`absolute top-3 right-3 p-1 rounded-full transition cursor-pointer ${
//                           animate ? "pop" : ""
//                         }`}
//                       >
//                         <Heart
//                           className="w-5 h-5"
//                           fill={isInCart ? "red" : "none"}
//                           stroke={isInCart ? "red" : "currentColor"}
//                         />
//                       </button>

//                       <h2 className="text-lg font-semibold text-gray-800">
//                         {product.name}
//                       </h2>
//                       <p className="text-sm text-gray-600 line-clamp-2">
//                         {product.description || "No description available"}
//                       </p>
//                       <p className="text-blue-600 font-bold mt-2">
//                         ₹{product.price || "N/A"}
//                       </p>

//                       <button
//                         onClick={() => handleBuy(product)}
//                         className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition mt-4 cursor-pointer"
//                       >
//                         Buy Now
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>

//               {hasMore && (
//                 <div className="flex justify-center mt-10">
//                   <button
//                     onClick={handleLoadMore}
//                     disabled={loading}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
//                   >
//                     {loading && (
//                       <Loader2 className="w-5 h-5 animate-spin text-white" />
//                     )}
//                     {loading ? "Loading..." : "Load More"}
//                   </button>
//                 </div>
//               )}

//               {!hasMore && page >= totalPages && (
//                 <p className="text-center text-gray-500 mt-8">
//                   🎉 You’ve reached the end!
//                 </p>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Product;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart, removeFromCart } from "../redux/slices/cartSlice";
import { Loader2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarPublic from "../components/layout/NavbarPublic";
import HeroBanner from "../components/layout/HeroBanner";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, page, hasMore } = useSelector(
    (state) => state.products
  );
  const { token } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];
  const productList = searchResults.length > 0 ? searchResults : list;

  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [animatingHearts, setAnimatingHearts] = useState({});
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (list.length === 0) {
      dispatch(fetchProducts({ page: 1 }));
    }
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loading) dispatch(fetchProducts({ page: page + 1 }));
  };

  const handleBuy = (product) => {
    if (!token) return alert("Please login to buy!");
    navigate("/checkout", { state: { product } });
  };

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  const toggleLike = (product) => {
    if (!token) return alert("Please login to like products!");
    const isInCart = cartItems.some((item) => item._id === product._id);
    if (isInCart) dispatch(removeFromCart(product._id));
    else dispatch(addToCart(product));
    setAnimatingHearts((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAnimatingHearts((prev) => ({ ...prev, [product._id]: false }));
    }, 400);
  };

  const nextImage = (productId, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % total,
    }));
  };

  const prevImage = (productId, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]:
        (prev[productId] || 0) === 0 ? total - 1 : prev[productId] - 1,
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      productList.forEach((product) => {
        const total = product.images?.length || 0;
        if (total > 1) {
          setCurrentImageIndex((prev) => ({
            ...prev,
            [product._id]: ((prev[product._id] || 0) + 1) % total,
          }));
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [productList]);

  return (
    <>
      <NavbarPublic />
      <HeroBanner />
      <div className="relative min-h-screen bg-gray-50 py-12 px-5 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-100 to-blue-200 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div
          className="absolute -bottom-32 -right-24 w-80 h-80 bg-gradient-to-tr from-pink-100 to-pink-200 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        ></div>

        <div className="relative max-w-7xl mx-auto z-10">
          {loading && productList.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            </div>
          ) : productList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-40 h-40 text-gray-300 mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h18v18H3V3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3l18 18"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-700">
                No Products Found
              </h2>
              <p className="text-gray-500 mt-2">
                Try searching for another dress or designer
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {productList.map((product) => {
                  const images =
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images
                      : [];
                  const index = currentImageIndex[product._id] || 0;
                  const isInCart = cartItems.some(
                    (item) => item._id === product._id
                  );
                  const animate = animatingHearts[product._id];

                  const discountPercent = 30;
                  const originalPrice = product.price;
                  const discountAmount = (originalPrice * discountPercent) / 100;
                  const discountedPrice = originalPrice - discountAmount;

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-200 relative"
                    >
                      <div className="relative">
                        <img
                          src={images[index]}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                          onClick={() => handleViewDetails(product._id)}
                        />

                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() =>
                                prevImage(product._id, images.length)
                              }
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                nextImage(product._id, images.length)
                              }
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => toggleLike(product)}
                          className={`absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:bg-white transition ${
                            animate ? "pop" : ""
                          }`}
                        >
                          <Heart
                            className="w-5 h-5"
                            fill={isInCart ? "red" : "none"}
                            stroke={isInCart ? "red" : "gray"}
                          />
                        </button>
                      </div>

                      <div className="px-4 pb-4 pt-3 text-left">
                        <h2
                          onClick={() => handleViewDetails(product._id)}
                          className="text-sm font-semibold text-gray-900 mt-1 cursor-pointer hover:text-blue-600 line-clamp-1"
                        >
                          {product.name}
                        </h2>

                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                          {product.description || "No description available"}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded flex items-center">
                            4.2★
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-semibold text-gray-900">
                            ₹{Math.round(discountedPrice)}
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            ₹{Math.round(originalPrice)}
                          </span>
                          <span className="text-green-600 text-sm font-medium">
                            {discountPercent}% off
                          </span>
                        </div>

                        <p className="text-xs text-green-700 mt-1">
                          Buy 2 items, save extra ₹40
                        </p>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleBuy(product)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm py-2 rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition transform hover:-translate-y-0.5"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={() => handleViewDetails(product._id)}
                            className="flex-1 border border-blue-600 text-blue-600 text-sm py-2 rounded-lg hover:bg-blue-50 transition"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center gap-2 cursor-pointer"
                  >
                    {loading && (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    )}
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;