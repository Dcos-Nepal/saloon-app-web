import * as actionType from '../constants';

const initialState: any = {
  visits: {data: {rows: [], totalCount: 0}},
  visit: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const visitsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_VISITS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_VISITS_SUCCESS: {
      state.isLoading = false;
      state.visits = action.payload;
      return { ...state };
    }

    case actionType.FETCH_VISITS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.visits = action.payload;
      return { ...state };
    }

    case actionType.FETCH_VISIT: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_VISIT_SUCCESS: {
      state.isLoading = false;
      state.visit = action.payload;
      return { ...state };
    }

    case actionType.ADD_VISIT: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.ADD_VISIT_SUCCESS: {
      state.visit = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.ADD_VISIT_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.visit = action.payload;
      return { ...state };
    }

    case actionType.UPDATE_VISIT: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_VISIT_SUCCESS: {
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.visits.data.rows = state.visits.data.rows.map((visit: any) => {
        if (visit._id === action.payload._id) {
          return action.payload;
        }
        return visit;
      });
  
      return { ...state, visits: {...state.visits}};
    }

    case actionType.UPDATE_VISIT_ERROR: {
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

export default visitsReducer;
