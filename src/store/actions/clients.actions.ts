import { IClient } from "common/types/client";
import {
  ADD_CLIENT,
  FETCH_CLIENT,
  UPDATE_CLIENT,
  FETCH_CLIENTS,
} from "store/constants";

export const fetchClients = (data: any) => {
  return {
    type: FETCH_CLIENTS,
    payload: data,
  };
};

export const addClient = (data: IClient) => {
  return {
    type: ADD_CLIENT,
    payload: data,
  };
};

export const fetchClient = (id: string) => {
  return {
    type: FETCH_CLIENT,
    payload: id,
  };
};

export const updateClient = (data: IClient) => {
  return {
    type: UPDATE_CLIENT,
    payload: data,
  };
};
