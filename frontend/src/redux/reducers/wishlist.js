import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;
      // Check for both _id and id fields
      const itemId = item._id || item.id;
      const isItemExist = state.wishlist.find((i) => {
        const existingId = i._id || i.id;
        return existingId === itemId;
      });
      if (isItemExist) {
        // Update existing item
        state.wishlist = state.wishlist.map((i) => {
          const existingId = i._id || i.id;
          return existingId === itemId ? item : i;
        });
      } else {
        // Add new item
        state.wishlist.push(item);
      }
    })
    .addCase("removeFromWishlist", (state, action) => {
      // Remove item by filtering - action.payload can be _id or id
      const targetId = action.payload;
      state.wishlist = state.wishlist.filter((i) => {
        const existingId = i._id || i.id;
        return existingId !== targetId;
      });
    });
});
