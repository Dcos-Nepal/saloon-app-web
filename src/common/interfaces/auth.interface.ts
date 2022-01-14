export interface IUserRegister {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  email: string;
  currentPassword: string;
  newPassword: string;
  newPasswordToken: string;
}
