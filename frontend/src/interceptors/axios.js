import axios from "axios";

const BASE_URL = "/api/v1";

axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const token = localStorage.getItem("authToken");
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const response = await axios.post(
        "/auth/refresh",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.accessToken);
        prevRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data["accessToken"]}`;
        return axios(prevRequest);
      }
    }
    return Promise.reject(error);
  }
);

