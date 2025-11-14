import axios from "axios";
import { server } from "../../server";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch({
        type: "LoadUserFail",
        payload: "No token found",
      });
      return;
    }

    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({
      type: "LoadUserSuccess",
      payload: data?.user || data,
    });
  } catch (error) {
    // If 401, clear the token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data?.message || error.message || "Failed to load seller",
    });
  }
};

// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const token = localStorage.getItem("token");

      if (!token) {
        dispatch({
          type: "updateUserInfoFailed",
          payload: "Please login to update your information",
        });
        return;
      }

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data?.user || data,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response?.data?.message || error.message || "Failed to update user information",
      });
    }
  };

// update user address
export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
    async (dispatch) => {
      try {
        dispatch({
          type: "updateUserAddressRequest",
        });

        const { data } = await axios.put(
          `${server}/user/update-user-addresses`,
          {
            country,
            city,
            address1,
            address2,
            zipCode,
            addressType,
          },
          { withCredentials: true }
        );

        dispatch({
          type: "updateUserAddressSuccess",
          payload: {
            successMessage: "User address updated succesfully!",
            user: data.user,
          },
        });
      } catch (error) {
        dispatch({
          type: "updateUserAddressFailed",
          payload: error.response?.data?.message || error.message || "Failed to update address",
        });
      }
    };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "User deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response?.data?.message || error.message || "Failed to delete address",
    });
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response?.data?.message || error.message || "Failed to get users",
    });
  }
};