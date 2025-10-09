import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Loader2, Star } from "lucide-react";
import { fetchProductById, fetchProductReviews } from "../../redux/slices/productSlice.js";
import { placeOrder, cancelOrder } from "../../redux/slices/orderSlice.js";
import NavbarPublic from "../layout/NavbarPublic.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { list: orders } = useSelector((state) => state.orders);

  // Find the current order related to the product
  const currentOrder = orders.find(order => order.products.some(product => product.product._id === id));
  const currentStatus = currentOrder ? currentOrder.status : "";

  useEffect(() => {
    dispatch(fetchProductById(id)).then(() => {
      dispatch(fetchProductReviews(id));
    });
  }, [dispatch, id]);

  if (loading || !selected)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );

  const images =
    Array.isArray(selected.images) && selected.images.length > 0
      ? selected.images
      : ["https://via.placeholder.com/300x300?text=No+Image"];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const reviews = selected.reviews || [];
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : 0;

  const handleBuyNow = async () => {
    if (!user) {
      return navigate("/login");
    }
    const orderData = {
      userId: user.id,
      products: [{ productId: selected._id, quantity: 1 }],
    };
    try {
      const response = await dispatch(placeOrder(orderData)).unwrap();
      if (response) {
        navigate("/checkout", { state: { product: selected } });
      }
    } catch (error) {
      console.error("Order placement failed", error);
    }
  };

  const handleCancelOrder = async () => {
    if (currentOrder) {
      try {
        await dispatch(cancelOrder(currentOrder._id)).unwrap();
        navigate("/orders"); // Redirect to orders page after cancellation
      } catch (error) {
        console.error("Failed to cancel the order", error);
      }
    }
  };

  return (
    <>
      <NavbarPublic />
      <div className="max-w-7xl mx-auto mt-20 bg-white p-8 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md border rounded-lg overflow-hidden">
              <Slider {...sliderSettings}>
                {images.map((img, i) => (
                  <div key={i} className="flex justify-center">
                    <img
                      src={img}
                      alt={`Product ${i}`}
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800">{selected.name}</h2>

            <div className="flex items-center gap-2 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.round(avgRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"}
                />
              ))}
              <span className="text-gray-600 text-sm ml-1">
                {avgRating} / 5 ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-gray-600 mt-3 text-lg">{selected.description}</p>
            <p className="text-3xl font-bold text-blue-600 mt-5">
              ₹{selected.price}
            </p>

            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {selected.category || "N/A"}
              </p>
              <p>
                <span className="font-medium">Availability:</span>{" "}
                {selected.available ? "In Stock" : "Out of Stock"}
              </p>
              {selected.expectedDelivery && (
                <p>
                  <span className="font-medium">Expected Delivery:</span>{" "}
                  {new Date(selected.expectedDelivery).toLocaleDateString("en-IN")}
                </p>
              )}
              {selected.returnPolicy && (
                <p>
                  <span className="font-medium">Return Policy:</span>{" "}
                  {selected.returnPolicy}
                </p>
              )}
            </div>

            {selected.specifications && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Specifications
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {Array.isArray(selected.specifications)
                    ? selected.specifications.map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))
                    : <li>{selected.specifications}</li>}
                </ul>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={handleBuyNow}  
              >
                Buy Now
              </button>
              {currentStatus !== "Delivered" && currentStatus && (
                <button
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-12 border-t pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Customer Reviews
            </h3>
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{review.username}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={16}
                          className={idx < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
