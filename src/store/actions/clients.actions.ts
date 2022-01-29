import { ADD_CLIENT, FETCH_CLIENTS } from "store/constants";

export const fetchClients = (data: any) => {
  return {
    type: FETCH_CLIENTS,
    payload: data,
  };
};

export const addClient = (data: any) => {
  return {
    type: ADD_CLIENT,
    payload: data,
  };
};
