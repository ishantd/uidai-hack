import axios from 'axios';

const axiosUnauthorizedInstance = axios.create({
  baseURL: 'http://3.109.35.156',
  timeout: 10000,
});

const axiosInstance = axios.create({
    baseURL: 'http://3.109.35.156',
    timeout: 10000,
});

export const setClientToken = (token) => {
  axiosInstance.interceptors.request.use(function(config) {
    config.headers.Authorization = `JWT ${token}`;
    console.log(token);
    return config;
  });
};

export { axiosInstance, axiosUnauthorizedInstance };