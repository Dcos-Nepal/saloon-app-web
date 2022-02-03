export interface IClient {
  _id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  address?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  userDocuments?: {
    documentUrl: string;
    type: string;
  }[];
  roles: string[];
  password?: string;
  userImage?: string;
}
