import * as actionType from '../constants';

const initialState = {
  jobs: null,
  currentUser: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const jobsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_JOBS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_JOBS_SUCCESS: {
      state.isLoading = false;
      state.jobs = action.payload;
      return { ...state };
    }

    case actionType.FETCH_JOBS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.jobs = action.payload;
      return { ...state };
    }

    case actionType.ADD_JOB: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.ADD_JOB_SUCCESS: {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.ADD_JOB_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentUser = action.payload;
      return { ...state };
    }

    default: {
      return { ...state };
    }
  }
};

export default jobsReducer;
