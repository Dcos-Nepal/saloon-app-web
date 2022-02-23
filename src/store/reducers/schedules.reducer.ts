import * as actionType from '../constants';

const initialState = {
  schedules: [],
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const scheduleReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_JOB_SCHEDULE: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_JOB_SCHEDULE_SUCCESS: {
      state.isLoading = false;
      state.schedules = action.payload;
      return { ...state };
    }

    case actionType.FETCH_JOB_SCHEDULE_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.schedules = action.payload;
      return { ...state };
    }

    default: {
      return { ...state };
    }
  }
};

export default scheduleReducer;
