import { ADD_ORDER, FETCH_ORDER, FETCH_ORDERS, UPDATE_ORDER, UPDATE_ORDER_STATUS } from "store/constants";

export const fetchOrders = (data: any) => {
  return {
    type: FETCH_ORDERS, payload: data
  };
};

export const createOrders = (data: any) => {
  return {
    type: ADD_ORDER, payload: data
  };
};

export const fetchOrder = (id: string, params: any) => {
  return {
    type: FETCH_ORDER, payload: {id, params}
  };
};

export const updateOrder = (id: string, data: any) => {
  return {
    type: UPDATE_ORDER, payload: {id, data}
  };
};

export const updateOrderStatus = (payload: any) => {
  return {
    type: UPDATE_ORDER_STATUS, payload
  };
};
