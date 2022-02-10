import { ADD_QUOTE, FETCH_QUOTES, UPDATE_QUOTE } from "store/constants";

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

export const updateQuoteStatus = (data: any) => {
  return {
    type: UPDATE_QUOTE, payload: data
  };
};
