import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { getAllProducts } from "../redux/actions/product";

const BestSellingPage = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const { allProducts, loading } = useSelector((state) => state.product);

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, allProducts]);

  useEffect(() => {
    if (allProducts?.length) {
      const sorted = [...allProducts].sort(
        (a, b) => (b.sold_out || 0) - (a.sold_out || 0)
      );
      setData(sorted);
    }
  }, [allProducts]);

  if (loading) return <Loader />;

  return (
    <>
      <Header activeHeading={2} />
      <br />
      <br />
      <div className={styles.section}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
          {data.map((item) =>
            item._id ? <ProductCard key={item._id} data={item} /> : null
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BestSellingPage;
