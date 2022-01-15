import * as actionType from "../constants";

const comnState = {
  isFailed: false,
  isSuccess: false,
  isLoading: false,
};

const initialState = {
  signup: {...comnState},
  signIn: {...comnState},
  verify: {...comnState},
  forgotPwd: {...comnState},
  resetPwd: {...comnState},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionType.AUTH_SIGNUP: {
      state.signup.isLoading = true;
      return {...state};
    }

    case actionType.AUTH_EMAIL_VERIFY: {
      state.verify.isLoading = true;
      return {...state};
    }

    case actionType.AUTH_SIGNIN: {
      state.signIn.isLoading = true;
      return {...state};
    }

    case actionType.AUTH_FORGOT_PWD: {
      state.forgotPwd.isLoading = true;
      return {...state};
    }

    case actionType.AUTH_RESET_PWD: {
      state.resetPwd.isLoading = true;
      return {...state};
    }

    case actionType.AUTH_SIGNUP_SUCCESS: {
      state.signup = {
        isSuccess: true,
        isFailed: false,
        isLoading: false
      };

      return {...state};
    }
    
    case actionType.AUTH_EMAIL_VERIFY_SUCCESS: {
      state.verify = {
        isSuccess: true,
        isFailed: false,
        isLoading: false
      };

      return {...state};
    }

    case actionType.AUTH_SIGNIN_SUCCESS: {
      state.signIn = {
        isSuccess: true,
        isFailed: false,
        isLoading: false
      };

      return {...state};
    }

    case actionType.AUTH_FORGOT_PWD_SUCCESS: {
      state.forgotPwd = {
        isSuccess: true,
        isFailed: false,
        isLoading: false
      };

      return {...state};
    }

    case actionType.AUTH_RESET_PWD_SUCCESS: {
      state.resetPwd = {
        isSuccess: true,
        isFailed: false,
        isLoading: false
      };

      return {...state};
    }

    case actionType.AUTH_SIGNUP_ERROR: {
      state.signup = {
        isSuccess: false,
        isFailed: true,
        isLoading: false
      };

      return {...state};
    }

    case actionType.AUTH_EMAIL_VERIFY_ERROR: {
      state.verify = {
        isSuccess: false,
        isFailed: true,
        isLoading: false
      };

      return {...state};
    }

    case actionType.AUTH_SIGNIN_ERROR: {
      state.signIn = {
        isSuccess: false,
        isFailed: true,
        isLoading: false
      };

      return {...state};
    }

    case actionType.AUTH_FORGOT_PWD_ERROR: {
      state.forgotPwd = {
        isSuccess: false,
        isFailed: true,
        isLoading: false
      };

      return {...state};
    }

    case actionType.AUTH_RESET_PWD_ERROR: {
      state.resetPwd = {
        isSuccess: false,
        isFailed: true,
        isLoading: false
      };

      return {...state};
    }

    default: {
      return { ...state };
    }
  }
}
