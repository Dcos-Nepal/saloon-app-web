import { arrowFunctionExpression } from "@babel/types";
import * as actionType from "../constants";

const initialState = {
  itemList: {data: {rows: [], totalCount: 0}},
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false,
};

const invoicesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.ADD_INVOICE: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_INVOICE: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_INVOICES: {
      state.isLoading = true;
      return {...state};
    }

    case actionType.FETCH_INVOICE: {
      state.isLoading = true;
      return {...state};
    }

    case actionType.FETCH_INVOICE_SUCCESS: {
      state.isLoading = false;
      state.currentItem = action.payload;
      return {...state};
    }

    case actionType.ADD_INVOICE_SUCCESS: {
      state.isLoading = false;
      return {...state};
    }

    case actionType.UPDATE_INVOICE_SUCCESS: {
      state.isLoading = false;
      state.itemList.data.rows = state.itemList?.data?.rows.filter((item: any) => {
        if ((item as any)._id === action.payload._id) {
          item.isPaid = action.payload.isPaid;
          item.paidDate = action.payload.paidDate;
        }
        return true;
      });
      return {...state};
    }

    case actionType.FETCH_INVOICES_SUCCESS: {
      state.isLoading = false;
      state.itemList = action.payload;
      return {...state};
    }

    case actionType.ADD_INVOICE_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      return {...state};
    }
    
    case actionType.FETCH_INVOICES_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.itemList = action.payload;
      return {...state};
    }

    default: {
      return { ...state };
    }
  }
}

export default invoicesReducer;
