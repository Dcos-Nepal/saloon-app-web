import axios from "axios";
import { toast } from 'react-toastify';
import { clearData, getData, setData } from "./storage";

export const getAccessToken = async () => {
  return await getData("accessToken");
};

export const setAccessToken = async (token: string) => {
  return await setData("accessToken", token);
};

export const getRefreshToken = async () => {
  return await getData("refreshToken");
};

export const http = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Is connection error is notified?
let isConnectionErrorNotified = false;

// Is expired?
let isSessionExpired = false;

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
  async (error) => {
    // Checking for Network Error
    if (typeof error === 'object' && error.message === 'Network Error') {
      if (!isConnectionErrorNotified) {
        toast.error('Connection to server has been lost!', { position: 'bottom-center' });
        isConnectionErrorNotified = true;
      }

      window.location.href = '/connection-error';
      return Promise.reject(error);
    }

    const originalConfig = error.config;

    if (originalConfig.url !== "/login" && error.response) {

      // Access Token was expired
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await http.put("/v1/auth/refresh", {
            refreshToken: await getRefreshToken(),
          });

          const { accessToken, refreshToken } = rs.data.data;
          setData('accessToken', accessToken);
          setData('refreshToken', refreshToken);

          // Updates Authorization Token of previous API call
          originalConfig.headers.Authorization = `Bearer ${accessToken}`;

          // Call previous failed API call
          return http(originalConfig);
        } catch (_error) {
          if (!isSessionExpired) {
            toast.error("Your session expired!", {position: 'bottom-center'});
            clearData();
            isSessionExpired = true;
          }

          // Redirect to the signin in URL
          window.location.href = '/signIn?redirect=' + encodeURI(window.location.href);

          // Or reject he promise with error
          return Promise.reject(_error);
        }
      }
    }

    // Return the rejected promise with error details.
    return Promise.reject(error.response.data);
  },
);
