import { getUuid } from 'utils';
import * as actionType from '../constants';

const initialState: any = {
  workers: { data: { rows: [], totalCount: 0 } },
  currentUser: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const workersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_WORKERS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_WORKERS_SUCCESS: {
      state.isLoading = false;
      state.workers = action.payload;
      return { ...state };
    }

    case actionType.FETCH_WORKERS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.workers = action.payload;
      return { ...state };
    }

    case actionType.ADD_WORKER: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.ADD_WORKER_SUCCESS: {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.workers.data.rows = [action.payload, ...state.workers.data.rows];

      return {_id: getUuid(), ...state, workers: { ...state.workers }};
    }

    case actionType.ADD_WORKER_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentUser = action.payload;
      return { ...state };
    }

    case actionType.UPDATE_WORKER: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_WORKER_SUCCESS: {
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.workers.data.rows = state.workers.data.rows.map((worker: any) => {
        if (worker._id === action.payload._id) {
          return action.payload;
        }
        return worker;
      });

      return { ...state, workers: { ...state.workers } };
    }

    case actionType.UPDATE_WORKER_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentUser = action.payload;
      return { ...state };
    }

    case actionType.FETCH_WORKER: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_WORKER_SUCCESS: {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.FETCH_WORKER_ERROR: {
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

export default workersReducer;
