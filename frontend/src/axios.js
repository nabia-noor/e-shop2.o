import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // ✅ Backend ka base URL
  withCredentials: true, // agar cookies/token use ho raha
});

export default instance;
