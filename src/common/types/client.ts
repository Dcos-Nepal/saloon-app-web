export interface IClient {
  _id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  photo?: object | string;
}
