import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}`,
  headers: {
    "Content-type": "application/json",
  }
});

// Check if running in the browser before setting the Authorization header
if (typeof window !== 'undefined') {
  const storeToken = localStorage.getItem('storeToken');
  if (storeToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storeToken}`;
  }
}

export default axiosInstance;
