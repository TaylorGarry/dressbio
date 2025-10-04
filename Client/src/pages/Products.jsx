import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="font-semibold">{product.name}</h2>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
