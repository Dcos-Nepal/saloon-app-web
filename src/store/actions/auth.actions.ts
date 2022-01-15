import { AUTH_EMAIL_VERIFY, AUTH_FORGOT_PWD, AUTH_RESET_PWD, AUTH_SIGN_IN, AUTH_SIGNUP } from "store/constants";

export const registerUser = (data: any) => {
  return {
    type: AUTH_SIGNUP, payload: data
  };
};

export const signInUser = (data: any) => {
  return {
    type: AUTH_SIGN_IN, payload: data
  };
};

export const verifyEmail = (verificationCode: string) => {
  return {
    type: AUTH_EMAIL_VERIFY, payload: verificationCode
  };
};

export const forgotPassword = (data: any) => {
  return {
    type: AUTH_FORGOT_PWD, payload: data
  };
};

export const resetPassword = (data: any) => {
  return {
    type: AUTH_RESET_PWD, payload: data
  };
};
