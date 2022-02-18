import { ADD_INVOICE, FETCH_INVOICE, FETCH_INVOICES, UPDATE_INVOICE } from "store/constants";

export const fetchInvoices = (data: any) => {
  return {
    type: FETCH_INVOICES, payload: data
  };
};

export const createInvoices = (data: any) => {
  return {
    type: ADD_INVOICE, payload: data
  };
};

export const fetchInvoice = (id: string, params: any) => {
  return {
    type: FETCH_INVOICE, payload: {id, params}
  };
};

export const updateInvoice = (id: string, data: any) => {
  return {
    type: UPDATE_INVOICE, payload: {id, data}
  };
};
