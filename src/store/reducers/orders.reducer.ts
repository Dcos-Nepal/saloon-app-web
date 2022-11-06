import * as actionType from '../constants';

const initialState: any = {
  itemList: { data: { rows: [], totalCount: 0 } },
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const ordersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.ADD_ORDER: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_ORDER: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_ORDER_STATUS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_ORDERS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_ORDER: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_ORDER_SUCCESS: {
      state.isLoading = false;
      state.currentItem = action.payload;
      return { ...state };
    }

    case actionType.ADD_ORDER_SUCCESS: {
      state.isLoading = false;
      state.currentItem = action.payload;
      state.itemList.data.rows = [action.payload, ...state.itemList.data.rows];

      return { ...state, itemList: { ...state.itemList } };
    }

    case actionType.UPDATE_ORDER_SUCCESS: {
      state.isLoading = false;

      state.itemList.data.rows = state.itemList?.data?.rows.filter((item: any) => {
        if ((item as any)._id === action.payload._id) {
          item = action.payload;
        }
        return item;
      });
      return { ...state };
    }

    case actionType.UPDATE_ORDER_STATUS_SUCCESS: {
      state.isLoading = false;
      state.itemList.data.rows = state.itemList?.data?.rows.filter((item: any) => {
        if ((item as any)._id === action.payload._id) {
          (item as any).status = {...action.payload.status};
        }
        return item;
      });
      return { ...state };
    }

    case actionType.FETCH_ORDERS_SUCCESS: {
      state.isLoading = false;
      state.itemList = action.payload;
      return { ...state };
    }

    case actionType.ADD_ORDER_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      return { ...state };
    }

    case actionType.FETCH_ORDERS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.itemList = action.payload;
      return { ...state };
    }

    default: {
      return { ...state };
    }
  }
};

export default ordersReducer;
