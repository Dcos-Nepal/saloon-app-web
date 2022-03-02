import { http } from "utils/http";
import { IForgotPassword, IResetPassword, IUserLogin, IUserRegister } from "common/interfaces/auth.interface";

export const registerUserApi = async (data: IUserRegister) => {
  return await http.post("/v1.0.0/auth/register", data, {
    headers: { "Accept": "application/json" }
  });
}

export const verifyEmailApi = async (verificationCode: string) => {
  return await http.get(`/v1.0.0/auth/verify/${verificationCode}`, {
    headers: { "Accept": "application/json" }
  });
}

export const signInUserApi = async (data: IUserLogin) => {
  return await http.post("/v1.0.0/auth/login", data, {
    headers: { "Accept": "application/json" }
  });
}

export const forgotUserPasswordApi = async (data: IForgotPassword) => {
  return await http.post("/v1.0.0/auth/forgot-password", data, {
    headers: { "Accept": "application/json" }
  });
}

export const changePasswordApi = async (data: any) => {
  return await http.post("/v1.0.0/auth/reset-password", data, {
    headers: { "Accept": "application/json" }
  });
}

export const resetUserPasswordApi = async (data: IResetPassword) => {
  return await http.post("/v1.0.0/auth/reset-password", data, {
    headers: { "Accept": "application/json" }
  });
}
