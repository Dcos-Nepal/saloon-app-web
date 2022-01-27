import * as actionType from "../constants";

const initialState = {
  itemList: null,
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false,
};

const quotesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_QUOTES: {
      state.isLoading = true;
      return {...state};
    }

    case actionType.FETCH_QUOTES_SUCCESS: {
      console.log(action.payload);
      state.isLoading = false;
      state.itemList = action.payload;
      return {...state};
    }

    case actionType.FETCH_QUOTES_ERROR: {
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

export default quotesReducer;
