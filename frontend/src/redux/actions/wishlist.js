// add to wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToWishlist",
    payload: data,
  });

  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  );
  return data;
};

// remove from wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
  const itemId = data._id || data.id;
  dispatch({
    type: "removeFromWishlist",
    payload: itemId,
  });
  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  );
  return data;
};
