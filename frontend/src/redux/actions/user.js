import axios from "axios";
import { server } from "../../server";

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true, // VERY important for sending cookies/session
    });
    console.log("LoadUser response:", data);

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update user information
export const updateUserInformation = (userData) => async (dispatch) => {
  try {
    console.log("Updating user info...", userData);
  } catch (error) {
    console.error("Update failed", error);
  }
};

// Update user address
export const updatUserAddress = (addressData) => async (dispatch) => {
  try {
    console.log("Updating user address...", addressData);
  } catch (error) {
    console.error("Address update failed", error);
  }
};

// Delete user address
export const deleteUserAddress = (addressId) => async (dispatch) => {
  try {
    console.log("Deleting user address...", addressId);
    // Example: await axios.delete(`${server}/user/address/${addressId}`);
  } catch (error) {
    console.error("Delete address failed", error);
  }
};

// load seller()
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadSellerRequest" });
    const { data } = await axios.get(`${server}/shop/getSeller`, { withCredentials: true });
    console.log("LoadSeller response:", data);
    dispatch({ type: "LoadSellerSuccess", payload: data.seller || data.user });
  } catch (error) {
    console.log("LoadSeller error:", error.response?.data?.message || error.message);
    dispatch({ type: "LoadSellerFail", payload: error.response?.data?.message || error.message });
  }
}