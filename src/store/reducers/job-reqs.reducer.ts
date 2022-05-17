import * as actionType from '../constants';

const initialState: any = {
  itemList: { data: { rows: [], totalCount: 0 } },
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const jobRequestReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_JOB_REQUESTS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_JOB_REQUESTS_SUCCESS: {
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
      state.itemList.data.rows = [action.payload, ...state.itemList.data.rows];

      return { ...state, itemList: { ...state.itemList } };
    }

    case actionType.ADD_JOB_REQUEST_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentItem = action.payload;
      return { ...state };
    }

    case actionType.UPDATE_JOB_REQUEST: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_JOB_REQUEST_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.itemList.data.rows = state.itemList.data.rows.map((item: any) => {
        if (item._id === action.payload._id) {
          return action.payload;
        }
        return item;
      });

      return { ...state, itemList: { ...state.itemList } };
    }

    case actionType.UPDATE_JOB_REQUEST_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentItem = action.payload;
      return { ...state };
    }

    case actionType.FETCH_JOB_REQUEST: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_JOB_REQUEST_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.FETCH_JOB_REQUEST_ERROR: {
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
