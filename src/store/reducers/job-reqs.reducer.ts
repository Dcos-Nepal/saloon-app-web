import * as actionType from "../constants";

const initialState = {
  itemList: null,
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false,
};

const jobRequestReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_JOB_REQUESTS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_JOB_REQUESTS_SUCCESS: {
      console.log(action.payload);
      state.isLoading = false;
      state.itemList = action.payload;
      return { ...state };
    }

    case actionType.FETCH_JOB_REQUESTS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.itemList = action.payload;
      return { ...state };
    }

    case actionType.ADD_JOB_REQUEST: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.ADD_JOB_REQUEST_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.ADD_JOB_REQUEST_ERROR: {
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

export default jobRequestReducer;
