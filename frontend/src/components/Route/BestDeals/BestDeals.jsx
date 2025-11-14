import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { getAllProducts } from "../../../redux/actions/product";
import Loader from "../../Layout/Loader";

const BestDeals = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading } = useSelector((state) => state.product || {});
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, allProducts]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Sort by sold_out or total_sell (whichever field exists)
      const sorted = [...allProducts].sort((a, b) => {
        const aSold = a.sold_out || a.total_sell || 0;
        const bSold = b.sold_out || b.total_sell || 0;
        return bSold - aSold;
      });
      const firstFive = sorted.slice(0, 5);
      setData(firstFive);
    }
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
            {data && data.length > 0 ? (
              data.map((i, index) => (
                <ProductCard data={i} key={i._id || index} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
