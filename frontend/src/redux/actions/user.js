import axios from "../../axios";
import { server } from "../../server";

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });

    console.log("Axios baseURL is:", axios.defaults.baseURL);

    const { data } = await axios.get("/user/getuser");

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

// 🔻 ADD THESE PLACEHOLDER FUNCTIONS BELOW 🔻

// Update user information
export const updateUserInformation = (userData) => async (dispatch) => {
  try {
    console.log("Updating user info...", userData);
    // You can add your actual axios request here later
    // Example: await axios.put(`${server}/user/update`, userData);
  } catch (error) {
    console.error("Update failed", error);
  }
};

// Update user address
export const updatUserAddress = (addressData) => async (dispatch) => {
  try {
    console.log("Updating user address...", addressData);
    // Example: await axios.put(`${server}/user/address`, addressData);
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
