import { FETCH_JOB_REQUESTS } from "store/constants";

export const fetchJobRequests = (data: any) => {
  return {
    type: FETCH_JOB_REQUESTS, payload: data
  };
};
