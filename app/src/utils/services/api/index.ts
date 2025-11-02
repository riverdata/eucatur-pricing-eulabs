import axios from "axios";
import { StorageService } from "@utils/services/storage";
import { config } from "@utils/config";

const HTTP_UNAUTHORIZED = 401;

const api = axios.create({
  baseURL: config.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = StorageService.Token.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['ngrok-skip-browser-warning'] = 'true'
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === HTTP_UNAUTHORIZED) {
      localStorage.clear();
      location.reload();
    }

    return Promise.reject(error);
  }
);


export default api;
