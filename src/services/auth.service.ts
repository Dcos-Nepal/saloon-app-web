import { http } from "utils/http";
import { IForgotPassword, IResetPassword, IUserLogin, IUserRegister } from "common/interfaces/auth.interface";

export const registerUserApi = async (data: IUserRegister) => {
  return await http.post("auth/register", data, {
    headers: { "Accept": "application/json;v=1.0.0" }
  });
}

export const vedifyEmailApi = async (verificationCode: string) => {
  return await http.get(`auth/verify/${verificationCode}`, {
    headers: { "Accept": "application/json;v=1.0.0" }
  });
}

export const signInUserApi = async (data: IUserLogin) => {
  console.log(" Data Received: ", data);
  return await http.post("auth/login", data, {
    headers: { "Accept": "application/json;v=1.0.0" }
  });
}

export const forgotUserPasswordApi = async (data: IForgotPassword) => {
  console.log(" Data Received: ", data);
  return await http.post("auth/forgot-password", data, {
    headers: { "Accept": "application/json;v=1.0.0" }
  });
}

export const resetUserPasswordApi = async (data: IResetPassword) => {
  return await http.post("auth/reset-password", data, {
    headers: { "Accept": "application/json;v=1.0.0" }
  });
}

