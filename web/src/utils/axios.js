import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = `${process.env.REACT_APP_BACKEND_URL}/api`;
axios.defaults.headers.post["Content-Type"] = "application/json";
axiosInstance.interceptors.request.use(
  (config) => {
    const authUser = JSON.parse(window.localStorage.getItem("auth"));
    if (authUser?.token) {
      config.headers.Authorization = authUser.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response);
    if (error.response.status == 401) {
      window.localStorage.removeItem("auth");
      window.location.href = "/login";
      toast.warn(error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
