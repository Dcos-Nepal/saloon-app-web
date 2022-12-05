export interface IClient {
  _id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  photo?: object | string;
  photos?: string[];
  diagnosis?: any[];
  tags: string;
  notes?: string;
  referredBy?: string;
}
