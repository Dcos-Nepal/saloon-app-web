import { FETCH_CLIENTS } from "store/constants";

export const fetchClients = (data: any) => {
  return {
    type: FETCH_CLIENTS, payload: data
  };
};
