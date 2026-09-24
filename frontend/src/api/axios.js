import axios from "axios";

const API = axios.create({
  baseURL: "https://shopease-ecommerce-ruddy.vercel.app/api",
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;
