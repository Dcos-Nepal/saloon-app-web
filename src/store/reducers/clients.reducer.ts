import * as actionType from "../constants";

const initialState = {
  clients: null,
  currentUser: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false,
};

const clientsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_CLIENTS: {
      state.isLoading = true;
      return {...state};
    }

    case actionType.FETCH_CLIENTS_SUCCESS: {
      console.log(action.payload);
      state.isLoading = false;
      state.clients = action.payload;
      return {...state};
    }

    case actionType.FETCH_CLIENTS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.clients = action.payload;
      return {...state};
    }

    default: {
      return { ...state };
    }
  }
}

export default clientsReducer;
