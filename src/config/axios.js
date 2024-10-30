import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/",
  // baseURL: "http://14.225.220.131:8081/api/",
});
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error

    return Promise.reject(error);
  }
);
export default api;
