import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config: any) {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  function (error: any) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response: any) {
    return response;
  },

  async function (error: AxiosError) {
    const originalRequest = error.config as any;

    if (error.response == undefined) {
      window.location.href = "/mantenimiento";
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post("/auth/refresh");
        const { access_token } = response.data;

        Cookies.set("token", access_token, { expires: 30 });

        // Dispatch event for context update
        window.dispatchEvent(
          new CustomEvent("auth:refresh", { detail: access_token })
        );

        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${access_token}`;
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove("token");
        window.location.href = "/auth/iniciar-sesion";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
