import * as actionType from '../constants';

const initialState: any = {
  jobs: { data: { rows: [], totalCount: 0 } },
  job: null,
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

    case actionType.FETCH_JOB: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_JOB_SUCCESS: {
      state.isLoading = false;
      state.job = action.payload;
      return { ...state };
    }

    case actionType.ADD_JOB: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.ADD_JOB_SUCCESS: {
      state.job = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.jobs.data.rows = [action.payload, ...state.jobs.data.rows];

      return { ...state, jobs: { ...state.jobs } };
    }

    case actionType.ADD_JOB_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.job = action.payload;
      return { ...state };
    }

    case actionType.UPDATE_JOB: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_JOB_SUCCESS: {
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.jobs.data.rows = state.jobs.data.rows.map((job: any) => {
        if (job._id === action.payload._id) {
          return action.payload;
        }
        return job;
      });

      return { ...state, jobs: { ...state.jobs } };
    }

    case actionType.UPDATE_JOB_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      return { ...state };
    }

    default: {
      return { ...state };
    }
  }
};

export default jobsReducer;
