import { ADD_JOB_REQUEST, FETCH_JOB_REQUESTS } from "store/constants";

export const fetchJobRequests = (data: any) => {
  return {
    type: FETCH_JOB_REQUESTS,
    payload: data,
  };
};

export const addJobRequest = (data: any) => {
  return {
    type: ADD_JOB_REQUEST,
    payload: data,
  };
};
