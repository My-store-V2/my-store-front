import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}`,
  headers: {
    "Content-type": "application/json",
  }
});

  // Check if running in the browser before setting the Authorization header
  axiosInstance.interceptors.request.use(
    config => {
      const storeToken = localStorage.getItem('storeToken');
      if (storeToken) {
        config.headers['Authorization'] = `Bearer ${storeToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      // Check if error response status is 401
      if (error.response && error.response.status === 401) {
        console.log(error.response)
        localStorage.removeItem("storeToken")
        localStorage.removeItem("currentUser")
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;
