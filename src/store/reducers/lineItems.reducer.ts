import * as actionType from "../constants";

const initialState: any = {
  lineItems: {data: {rows: [], totalCount: 0}},
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false,
};

const lineItemsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_LINE_ITEMS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_LINE_ITEMS_SUCCESS: {
      state.isLoading = false;
      state.lineItems = action.payload;
      return { ...state };
    }

    case actionType.FETCH_LINE_ITEMS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.lineItems = action.payload;
      return { ...state };
    }

    case actionType.ADD_LINE_ITEM: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.ADD_LINE_ITEM_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.ADD_LINE_ITEM_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentItem = action.payload;
      return { ...state };
    }

    case actionType.UPDATE_LINE_ITEM: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_LINE_ITEM_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.lineItems.data.rows = state.lineItems.data.rows.map((lineItem: any) => {
        if (lineItem._id === action.payload._id) {
          return action.payload;
        }
        return lineItem;
      });
  
      return { ...state, lineItems: {...state.lineItems}};
    }

    case actionType.UPDATE_LINE_ITEM_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentItem = action.payload;
      return { ...state };
    }

    case actionType.FETCH_LINE_ITEM: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_LINE_ITEM_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.FETCH_LINE_ITEM_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentItem = action.payload;
      return { ...state };
    }

    default: {
      return { ...state };
    }
  }
};

export default lineItemsReducer;
