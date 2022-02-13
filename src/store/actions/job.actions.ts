import { ADD_JOB, FETCH_JOBS } from 'store/constants';

export const fetchJobs = (data: any) => {
  return {
    type: FETCH_JOBS,
    payload: data
  };
};

export const createJobs = (data: any) => {
  return {
    type: ADD_JOB,
    payload: data
  };
};
