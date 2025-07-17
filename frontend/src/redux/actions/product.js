import axios from "../../axios";

/* --------------------------------------------------
   Base URL of your backend
   -------------------------------------------------- */
export const server = "http://localhost:8000/api/v1";   // ← اپنی مرضی کا رکھیں

/* --------------------------------------------------
   1)  Create Product
   -------------------------------------------------- */
// productData = { name, description, category, ... }
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    // اگر images ہیں تو بہتر ہے FormData استعمال کریں:
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((img) => formData.append("images", img));
      } else {
        formData.append(key, value);
      }
    });

    const { data } = await axios.post(
      `${server}/product/create`,
      formData,
      { withCredentials: true }          // اگر cookie token وغیرہ چاہیے
    );

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* --------------------------------------------------
   2)  Get ALL products of ONE shop
   -------------------------------------------------- */
export const getAllProductsShop = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsShopRequest" });

    const { data } = await axios.get(
      `${server}/product/shop/${shopId}`
    );

    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* --------------------------------------------------
   3)  Delete one product (by seller)
   -------------------------------------------------- */
export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });

    const { data } = await axios.delete(
      `${server}/product/${productId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* --------------------------------------------------
   4)  Get ALL products (for customer side, best‑selling page وغیرہ)
   -------------------------------------------------- */
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });

    

    const { data } = await axios.get(`${server}/product/all`);

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
