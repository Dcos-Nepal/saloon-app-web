import { ADD_LINE_ITEM, FETCH_LINE_ITEM, FETCH_LINE_ITEMS, UPDATE_LINE_ITEM } from 'store/constants';

export const fetchLineItems = (data: any) => {
  return {
    type: FETCH_LINE_ITEMS,
    payload: data
  };
};

export const addLineItem = (data: any) => {
  return {
    type: ADD_LINE_ITEM,
    payload: data
  };
};

export const fetchLineItem = (id: string) => {
  return {
    type: FETCH_LINE_ITEM,
    payload: id
  };
};

export const updateLineItem = (data: any) => {
  return {
    type: UPDATE_LINE_ITEM,
    payload: data
  };
};
