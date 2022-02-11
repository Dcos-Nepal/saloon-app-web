import { ADD_QUOTE, FETCH_QUOTE, FETCH_QUOTES, UPDATE_QUOTE, UPDATE_QUOTE_STATUS } from "store/constants";

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

export const fetchQuote = (id: string, params: any) => {
  return {
    type: FETCH_QUOTE, payload: {id, params}
  };
};

export const updateQuote = (id: string, data: any) => {
  return {
    type: UPDATE_QUOTE, payload: {id, data}
  };
};

export const updateQuoteStatus = (id: string, data: any) => {
  return {
    type: UPDATE_QUOTE_STATUS, payload: {id, data}
  };
};
