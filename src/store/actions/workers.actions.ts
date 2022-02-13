import { IUser } from "common/types/user";
import {
  ADD_WORKER,
  FETCH_WORKER,
  FETCH_WORKERS,
  UPDATE_WORKER,
} from "store/constants";

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

export const fetchWorker = (id: string) => {
  return {
    type: FETCH_WORKER,
    payload: id,
  };
};

export const updateWorker = (data: IUser) => {
  return {
    type: UPDATE_WORKER,
    payload: data,
  };
};
