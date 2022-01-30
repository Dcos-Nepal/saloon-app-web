import { ADD_WORKER, FETCH_WORKERS } from "store/constants";

export const fetchWorkers = (data: any) => {
  return {
    type: FETCH_WORKERS,
    payload: data,
  };
};

export const addWorker = (data: any) => {
  return {
    type: ADD_WORKER,
    payload: data,
  };
};
