import * as actionType from '../constants';

const initialState: any = {
  itemList: { data: { rows: [], totalCount: 0 } },
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const quotesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.ADD_QUOTE: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_QUOTE: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_QUOTE_STATUS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_QUOTES: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_QUOTE: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_QUOTE_SUCCESS: {
      state.isLoading = false;
      state.currentItem = action.payload;
      return { ...state };
    }

    case actionType.ADD_QUOTE_SUCCESS: {
      state.isLoading = false;
      state.currentItem = action.payload;
      state.itemList.data.rows = [action.payload, ...state.itemList.data.rows];

      return { ...state, itemList: { ...state.itemList } };
    }

    case actionType.UPDATE_QUOTE_SUCCESS: {
      state.isLoading = false;

      state.itemList.data.rows = state.itemList?.data?.rows.filter((item: any) => {
        if ((item as any)._id === action.payload._id) {
          item = action.payload;
        }
        return item;
      });
      return { ...state };
    }

    case actionType.UPDATE_QUOTE_STATUS_SUCCESS: {
      state.isLoading = false;
      state.itemList.data.rows = state.itemList?.data?.rows.filter((item: any) => {
        if ((item as any)._id === action.payload._id) {
          (item as any).status = {...action.payload.status};
        }
        return item;
      });
      return { ...state };
    }

    case actionType.FETCH_QUOTES_SUCCESS: {
      state.isLoading = false;
      state.itemList = action.payload;
      return { ...state };
    }

    case actionType.ADD_QUOTE_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      return { ...state };
    }

    case actionType.FETCH_QUOTES_ERROR: {
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

export default quotesReducer;
