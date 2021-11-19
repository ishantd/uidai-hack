import axios from 'axios';

const axiosUnauthorizedInstance = axios.create({
    baseURL: 'http://192.168.5.163:8000',
    timeout: 10000,
});

const axiosInstance = axios.create({
    baseURL: 'http://192.168.5.163:8000',
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