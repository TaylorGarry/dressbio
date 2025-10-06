import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { Loader2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import NavbarPublic from "../components/layout/NavbarPublic";

const Product = () => {
  const dispatch = useDispatch();
  const { list, loading, page, hasMore, totalPages } = useSelector(
    (state) => state.products
  );
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];
  const productList = searchResults.length > 0 ? searchResults : list;

  const [likedProducts, setLikedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    if (list.length === 0) {
      dispatch(fetchProducts({ page: 1 }));
    }
  }, [dispatch]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(fetchProducts({ page: page + 1 }));
    }
  };

  const handleBuy = (product) => {
    if (!token) return alert("Please login to buy!");
    console.log("Buy product:", product);
  };

  const toggleLike = (productId) => {
    if (!token) return alert("Please login to like products!");
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
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
      <div className="min-h-screen bg-gray-100 mt-16 py-10 px-5">
        <div className="max-w-7xl mx-auto">
          {loading && productList.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
            </div>
          ) : productList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-illustration-download-in-svg-png-gif-file-formats--document-page-results-empty-state-pack-user-interface-illustrations-4978946.png"
                alt="No data found"
                className="w-60 h-60 object-contain mb-6"
              />
              <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
              <p className="text-gray-500 mt-2">Try searching for another dress or designer</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {productList.map((product) => {
                  const isLiked = likedProducts.includes(product._id);
                  const images =
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images
                      : ["https://via.placeholder.com/300x300?text=No+Image"];
                  const index = currentImageIndex[product._id] || 0;

                  return (
                    <div
                      key={product._id}
                      className="relative bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center"
                    >
                      <div className="relative w-40 h-40 mb-3 overflow-hidden rounded-md">
                        <img
                          src={images[index]}
                          alt={product.name}
                          className="w-40 h-40 object-cover rounded-md transition-transform duration-700 ease-in-out"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() =>
                                prevImage(product._id, images.length)
                              }
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-1 rounded-full hover:bg-white cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                nextImage(product._id, images.length)
                              }
                              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-1 rounded-full hover:bg-white cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => toggleLike(product._id)}
                        className="absolute top-3 right-3 p-1 rounded-full transition cursor-pointer"
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={isLiked ? "red" : "none"}
                          stroke={isLiked ? "red" : "currentColor"}
                        />
                      </button>

                      <h2 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description || "No description available"}
                      </p>
                      <p className="text-blue-600 font-bold mt-2">
                        ₹{product.price || "N/A"}
                      </p>

                      <button
                        onClick={() => handleBuy(product)}
                        className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition mt-4 cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
                  >
                    {loading && (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    )}
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}

              {!hasMore && page >= totalPages && (
                <p className="text-center text-gray-500 mt-8">
                  🎉 You’ve reached the end!
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
