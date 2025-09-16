import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../server"; // example: "http://localhost:8000/api/v1"

const BestSellingPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/product/best-selling`)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.error("Error fetching best-selling products:", err);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Best Selling Products</h2>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              <img
                src={
                  product.image_Url && product.image_Url[0]
                    ? product.image_Url[0].url
                    : "https://dummyimage.com/300x200/cccccc/000000&text=No+Image"
                }
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="mb-1">
                Price: ${product.discount_price ? product.discount_price : product.price}
              </p>
              <p className="text-gray-600">Sold: {product.total_sell}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No best-selling products available.</p>
      )}
    </div>
  );
};

export default BestSellingPage;
