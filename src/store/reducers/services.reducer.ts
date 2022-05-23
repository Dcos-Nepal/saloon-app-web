import * as actionType from "../constants";

const initialState: any = {
  items: {data: {rows: [], totalCount: 0}},
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false,
};

const servicesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_SERVICES: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_SERVICES_SUCCESS: {
      state.isLoading = false;
      state.items = action.payload;
      return { ...state };
    }

    case actionType.FETCH_SERVICES_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.items = action.payload;
      return { ...state };
    }

    default: {
      return { ...state };
    }
  }
};

export default servicesReducer;
