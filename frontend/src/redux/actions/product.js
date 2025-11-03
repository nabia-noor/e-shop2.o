import axios from "../../axios";


/* --------------------------------------------------
   Base URL of your backend
   -------------------------------------------------- */
export const server = "http://localhost:8000/api/v1";

/* --------------------------------------------------
   1)  Create Product
   -------------------------------------------------- */
// productData = { name, description, category, ... }
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });


    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key === "images") {
        // images is now an array of File objects
        if (Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        }
      } else if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    const { data } = await axios.post(
      `${server}/product/create-product`,
      formData,
      {
        withCredentials: true,
        // Don't set Content-Type header - browser will set it automatically with boundary for FormData
      }
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
      `${server}/product/get-all-products-shop/${shopId}`
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
      `${server}/product/delete-shop-product/${productId}`,
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
