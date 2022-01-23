import axios from "axios";
import { toast } from 'react-toastify';
import { getData } from "./storage";

export const getAccessToken = async () => {
  return await getData("accessToken");
};

export const http = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Is connection error is notified?
let isConnectionErrorNotified = false;

/**
 * Adds request interceptor
 * This interceptor adds Authorization header in each request if the access token is available.
 * @return Request Object
 */
http.interceptors.request.use(async (request: any) => {
  const authToken = await getAccessToken();
  if (authToken) {
    request.headers["Authorization"] = `Bearer ${authToken}`;
  }

  return request;
});

/**
 * Adds response interceptor
 * This response check for any errors and handles accordingly..
 * @return Object
 */
http.interceptors.response.use(
  response => Promise.resolve(response),
  error => {
    // Checking for Network Error
    if (typeof error === 'object' && error.message === 'Network Error') {
      if (!isConnectionErrorNotified) {
        toast.error('Connection to server has been lost!', { position: 'bottom-center' });
        isConnectionErrorNotified = true;
      }

      return Promise.reject(error);
    }

    // TODO interceptor other API errors here
    // More ...like 401, 404, 500, etc...

    // Return the rejected promise with error details.
    return Promise.reject(error.response.data);
  },
);
