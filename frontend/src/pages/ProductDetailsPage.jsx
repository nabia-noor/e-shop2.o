import React from "react";
import { useParams } from "react-router-dom";
import { productData } from "../static/data";

const ProductDetailsPage = () => {
  const { product_name } = useParams();

  // URL slug ko normal name me convert karna
  const formattedName = product_name.replace(/-/g, " ");

  // static data se product dhundhna
  const product = productData.find(
    (item) => item.name.toLowerCase() === formattedName.toLowerCase()
  );

  if (!product) {
    return <h2 className="text-center mt-10">Product not found</h2>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div>
          <img
            src={
    Array.isArray(product.image_Url)
      ? product.image_Url[0]?.url
      : product.image_Url || "https://via.placeholder.com/400x300?text=No+Image"
  } 
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="flex items-center space-x-4 mb-4">
            <span className="text-2xl font-semibold text-green-600">
              ${product.discount_price}
            </span>
            <span className="line-through text-gray-500">${product.price}</span>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Total Sold: {product.total_sell} | Stock: {product.stock}
          </p>

          {/* Shop Info */}
          <div className="flex items-center space-x-4 mt-6">
            <img
              src={product.shop.shop_avatar.url}
              alt={product.shop.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{product.shop.name}</h3>
              <p className="text-sm text-gray-600">
                Ratings: {product.shop.ratings} ⭐
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
