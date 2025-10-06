import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";

const NoDataFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <SearchX size={80} className="text-gray-400 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-700 mb-2">No Results Found</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        We couldn’t find any items matching your search. Try adjusting your keywords or explore our collections.
      </p>
      <button
        onClick={() => navigate("/products")}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Browse All Products
      </button>
    </div>
  );
};

export default NoDataFound;
