import * as actionType from '../constants';

const initialState: any = {
  clients: { data: { rows: [], totalCount: 0 } },
  currentUser: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const clientsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_CLIENTS: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_CLIENTS_SUCCESS: {
      state.isLoading = false;
      state.clients = action.payload;
      return { ...state };
    }

    case actionType.FETCH_CLIENTS_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.clients = action.payload;
      return { ...state };
    }

    case actionType.ADD_CLIENT: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.ADD_CLIENT_SUCCESS: {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.clients.data.rows = [...state.clients.data.rows];

      return { ...state, clients: { ...state.clients } };
    }

    case actionType.ADD_CLIENT_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentUser = action.payload;
      return { ...state };
    }

    case actionType.UPDATE_CLIENT: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_CLIENT_SUCCESS: {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.clients.data.rows = state.clients.data.rows.map((client: any) => {
        if (client._id === action.payload._id) {
          return action.payload;
        }
        return client;
      });

      return { ...state, clients: { ...state.clients } };
    }

    case actionType.UPDATE_CLIENT_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentUser = action.payload;
      return { ...state };
    }

    case actionType.FETCH_CLIENT: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_CLIENT_SUCCESS: {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.FETCH_CLIENT_ERROR: {
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

export default clientsReducer;
