import * as actionType from '../constants';

const initialState: {
  properties: any[];
  currentItem: any;
  isFailed: boolean;
  isSuccess: boolean;
  isLoading: boolean;
} = {
  properties: [],
  currentItem: null,
  isFailed: false,
  isSuccess: false,
  isLoading: false
};

const propertiesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionType.FETCH_PROPERTIES: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_PROPERTIES_SUCCESS: {
      state.isLoading = false;
      state.properties = action.payload;
      return { ...state };
    }

    case actionType.FETCH_PROPERTIES_ERROR: {
      state.isLoading = false;
      state.isFailed = true;
      state.properties = action.payload;
      return { ...state };
    }

    case actionType.ADD_PROPERTY: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.ADD_PROPERTY_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.properties = [...state.properties, action.payload];
      return { ...state };
    }

    case actionType.ADD_PROPERTY_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentItem = action.payload;
      return { ...state };
    }

    case actionType.UPDATE_PROPERTY: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.UPDATE_PROPERTY_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.UPDATE_PROPERTY_ERROR: {
      state.isSuccess = false;
      state.isLoading = false;
      state.isFailed = true;
      state.currentItem = action.payload;
      return { ...state };
    }

    case actionType.FETCH_PROPERTY: {
      state.isLoading = true;
      return { ...state };
    }

    case actionType.FETCH_PROPERTY_SUCCESS: {
      state.currentItem = action.payload;
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      return { ...state };
    }

    case actionType.DELETE_PROPERTY_SUCCESS: {
      state.isLoading = false;
      state.isFailed = false;
      state.isSuccess = true;
      state.currentItem = action.payload;
      state.properties = state.properties.filter((p) => action.payload._id !== p._id);

      return { ...state, properties: [...state.properties] };
    }

    case actionType.FETCH_PROPERTY_ERROR: {
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

export default propertiesReducer;
