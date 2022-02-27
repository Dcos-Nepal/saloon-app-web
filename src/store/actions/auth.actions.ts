import { AUTH_EMAIL_VERIFY, ADD_CURRENT_USER } from "store/constants";

export const addCurrentUser = (data: any) => {
  return {
    type: ADD_CURRENT_USER, payload: data
  };
};

export const verifyEmail = (verificationCode: string) => {
  return {
    type: AUTH_EMAIL_VERIFY, payload: verificationCode
  };
};

