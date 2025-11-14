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
      // Get item ID (handle both _id and id)
      const itemId = item._id || item.id;

      if (!itemId) {
        // If no ID, just add the item
        state.cart.push(item);
        return;
      }

      // Check if item exists (handle both _id and id)
      const isItemExist = state.cart.find((i) => {
        const existingItemId = i._id || i.id;
        return existingItemId === itemId;
      });

      if (isItemExist) {
        // Update existing item
        state.cart = state.cart.map((i) => {
          const existingItemId = i._id || i.id;
          return existingItemId === itemId ? item : i;
        });
      } else {
        // Add new item
        state.cart.push(item);
      }
    })
    .addCase("removeFromCart", (state, action) => {
      // Remove item by filtering (handle both _id and id)
      const targetId = action.payload;
      state.cart = state.cart.filter((i) => {
        const itemId = i._id || i.id;
        return itemId !== targetId;
      });
    });
});
