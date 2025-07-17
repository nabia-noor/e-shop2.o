import axios from "../../axios";
import { server } from "../../server";



//load user
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
      payload: error.response.data.message,
    });
  }
};