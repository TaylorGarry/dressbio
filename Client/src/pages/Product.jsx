import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { Loader2, Heart } from "lucide-react";

const Product = () => {
  const dispatch = useDispatch();
  const { list, loading, page, hasMore, totalPages } = useSelector(
    (state) => state.products
  );
  const { token } = useSelector((state) => state.auth);

  const [likedProducts, setLikedProducts] = useState([]);

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

  const handleAddToCart = (product) => {
    if (!token) return alert("Please login to add to cart!");
    console.log("Add to cart:", product);
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🛍️ Our Products
        </h1>

        {loading && list.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products available.
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {list.map((product) => {
                const isLiked = likedProducts.includes(product._id);
                return (
                  <div
  key={product._id}
  className="relative bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center"
>
  <img
    src={product.image || "https://via.placeholder.com/150?text=No+Image"}
    alt={product.name}
    className="w-40 h-40 object-cover rounded-md mb-3"
  />

  <button
    onClick={() => toggleLike(product._id)}
    className="absolute top-3 right-3 p-1 rounded-full transition"
  >
    <Heart
      className="w-5 h-5"
      fill={likedProducts.includes(product._id) ? "red" : "none"}
      stroke={likedProducts.includes(product._id) ? "red" : "currentColor"}
    />
  </button>

  <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
  <p className="text-sm text-gray-600 line-clamp-2">
    {product.description || "No description available"}
  </p>
  <p className="text-blue-600 font-bold mt-2">₹{product.price || "N/A"}</p>

  <button
    onClick={() => handleBuy(product)}
    className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition mt-4"
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
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
  );
};

export default Product;
