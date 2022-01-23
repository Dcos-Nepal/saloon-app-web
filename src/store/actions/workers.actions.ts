import { FETCH_WORKERS } from "store/constants";

export const fetchWorkers = (data: any) => {
  return {
    type: FETCH_WORKERS, payload: data
  };
};
