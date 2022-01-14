import * as actionType from "../constants";

const initialState = {
  error: null,
  payload: null,
  isFailed: null,
  isSuccess: null,
  isLoading: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionType.AUTH_SIGNUP: 
    case actionType.AUTH_EMAIL_VERIFY:
    case actionType.AUTH_SIGNIN:
    case actionType.AUTH_FORGOT_PWD:
    case actionType.AUTH_RESET_PWD: {
      return {
        ...state,
        isLoading: true
      };
    }

    case actionType.AUTH_SIGNUP_SUCCESS:
    case actionType.AUTH_EMAIL_VERIFY_SUCCESS:
    case actionType.AUTH_SIGNIN_SUCCESS:
    case actionType.AUTH_FORGOT_PWD_SUCCESS:
    case actionType.AUTH_RESET_PWD_SUCCESS: {
      return {
        ...state,
        isSuccess: true,
        isFailed: false,
        isLoading: false
      };
    }

    case actionType.AUTH_SIGNUP_ERROR:
    case actionType.AUTH_EMAIL_VERIFY_ERROR:
    case actionType.AUTH_SIGNIN_ERROR:
    case actionType.AUTH_FORGOT_PWD_ERROR:
    case actionType.AUTH_RESET_PWD_ERROR: {
      return {
        ...state,
        isSuccess: false,
        isFailed: true,
        isLoading: false
      };
    }

    default: {
      return { ...state };
    }
  }
}
