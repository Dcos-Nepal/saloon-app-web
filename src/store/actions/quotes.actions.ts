import { ADD_QUOTE, FETCH_QUOTES } from "store/constants";

export const fetchQuotes = (data: any) => {
  return {
    type: FETCH_QUOTES, payload: data
  };
};

export const createQuotes = (data: any) => {
  return {
    type: ADD_QUOTE, payload: data
  };
};
