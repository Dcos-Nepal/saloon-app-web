import { FETCH_QUOTES } from "store/constants";

export const fetchQuotes = (data: any) => {
  return {
    type: FETCH_QUOTES, payload: data
  };
};
