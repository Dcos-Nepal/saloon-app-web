import * as actionType from "../constants";

const initialState = {
  workers: null,
  currentUser: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false,
};

const workersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_WORKERS: {
      state.isLoading = true;
      return {...state};
    }

    case actionType.FETCH_WORKERS_SUCCESS: {
      state.isLoading = false;
      state.workers = action.payload;
      return {...state};
    }

    case actionType.FETCH_WORKERS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.workers = action.payload;
      return {...state};
    }

    default: {
      return { ...state };
    }
  }
}

export default workersReducer;
