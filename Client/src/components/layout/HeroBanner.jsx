import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="md:w-1/2 flex flex-col justify-center space-y-6 z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Discover Trendy Dresses
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Explore the latest collections, exclusive deals, and stylish dresses. Find your perfect look today!
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate("/my-orders")}
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow-sm"
          >
            Explore Orders
          </button>
        </div>
      </div>

      <div className="md:w-1/2 relative flex justify-center items-center mt-8 md:mt-0">
        <div
          className={`absolute -left-20 -top-20 w-80 h-80 bg-blue-100 rounded-full opacity-30 z-0 transition-transform duration-700`}
          style={{
            transform: `translateY(${scrollY * 0.2}px) ${
              hover ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)"
            }`,
          }}
        ></div>
        <div
          className={`absolute -right-16 -bottom-16 w-64 h-64 bg-pink-100 rounded-full opacity-30 z-0 transition-transform duration-700`}
          style={{
            transform: `translateY(${scrollY * -0.15}px) ${
              hover ? "scale(1.1) rotate(-5deg)" : "scale(1) rotate(0deg)"
            }`,
          }}
        ></div>
      </div>
    </section>
  );
};

export default HeroBanner;
