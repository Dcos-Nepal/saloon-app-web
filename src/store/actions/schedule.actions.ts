import { FETCH_JOB_SCHEDULE } from "store/constants";

export const fetchJobSchedule = (data: any) => {
  return {
    type: FETCH_JOB_SCHEDULE,
    payload: data
  };
};
