import axios from "../../axios";
import { server } from "../../server";

// create event
export const createevent = (eventData) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });

    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
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
      `${server}/event/create-event`,
      formData,
      {
        withCredentials: true,
        // Don't set Content-Type header - browser will set it automatically with boundary for FormData
      }
    );

    dispatch({
      type: "eventCreateSuccess",
      payload: data.event,
    });
  } catch (error) {
    dispatch({
      type: "eventCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsShopRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch({
      type: "getAlleventsShopSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteeventRequest",
    });

    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteeventSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteeventFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events`);
    console.log("Events API Response:", data);
    dispatch({
      type: "getAlleventsSuccess",
      payload: data.events || data.event || [],
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
