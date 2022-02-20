import { ADD_JOB, FETCH_JOBS, FETCH_JOB, UPDATE_JOB } from 'store/constants';

export const fetchJobs = (data: any) => {
  return {
    type: FETCH_JOBS,
    payload: data
  };
};

export const fetchJob = (id: string, params: any) => {
  return {
    type: FETCH_JOB,
    payload: { id, params }
  };
};

export const createJobs = (data: any) => {
  return {
    type: ADD_JOB,
    payload: data
  };
};

export const updateJob = (data: any) => {
  return {
    type: UPDATE_JOB,
    payload: data
  };
};
