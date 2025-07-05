import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);

      if (isItemExist) {
        // Update existing item by mutating state.cart array directly
        state.cart = state.cart.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        // Add new item
        state.cart.push(item);
      }
    })

    .addCase("removeFromCart", (state, action) => {
      // Filter out the item by id
      state.cart = state.cart.filter((i) => i._id !== action.payload);
    });
});
