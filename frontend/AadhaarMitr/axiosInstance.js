import axios from 'axios';

const axiosUnauthorizedInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',//'https://aadhaarmitr.tech',
    timeout: 10000,
});

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',//'https://aadhaarmitr.tech',
    timeout: 10000,
});

export const setClientToken = (token) => {
  axiosInstance.interceptors.request.use(function(config) {
    config.headers.Authorization = `Token ${token}`;
    console.log(token);
    return config;
  });
};

export { axiosInstance, axiosUnauthorizedInstance };