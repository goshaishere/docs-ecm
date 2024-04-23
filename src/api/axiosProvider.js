import axios from "axios";

function axiosProvider(baseUrl, options) {
  return axios.create({
    baseURL: baseUrl,
    ...options,
  });
}

export default axiosProvider;
