import { IRequest } from "common/types/request";
import {
  ADD_JOB_REQUEST,
  FETCH_JOB_REQUEST,
  FETCH_JOB_REQUESTS,
  UPDATE_JOB_REQUEST,
} from "store/constants";

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

export const fetchJobRequest = (id: string) => {
  return {
    type: FETCH_JOB_REQUEST,
    payload: id,
  };
};

export const updateJobRequest = (data: IRequest) => {
  return {
    type: UPDATE_JOB_REQUEST,
    payload: data,
  };
};
