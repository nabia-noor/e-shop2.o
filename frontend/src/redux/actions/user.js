import axios from "axios";

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await axios.get(
      "http://localhost:8000/api/v2/user/getuser",
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response.data.message,
    });
  }
};

// User login
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LoginRequest" });

    const { data } = await axios.post(
      "http://localhost:8000/api/v2/user/login-user",
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch({
      type: "LoginSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoginFail",
      payload: error.response.data.message,
    });
  }
};

// User register
export const registerUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: "RegisterUserRequest" });

    const { data } = await axios.post(
      "http://localhost:8000/api/v2/user/create-user",
      user,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch({
      type: "RegisterUserSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "RegisterUserFail",
      payload: error.response.data.message,
    });
  }
};

// User logout
export const logoutUser = () => async (dispatch) => {
  try {
    await axios.get("http://localhost:8000/api/v2/user/logout", {
      withCredentials: true,
    });

    dispatch({ type: "LogoutSuccess" });
  } catch (error) {
    dispatch({
      type: "LogoutFail",
      payload: error.response.data.message,
    });
  }
};
