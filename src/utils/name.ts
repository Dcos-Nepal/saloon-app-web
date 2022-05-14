import { IUser } from 'common/types/user';

export const getNameInitials = (user: IUser) => {
  let nameInitials = '';

  if (user.firstName.length) {
    nameInitials += user.firstName[0];
  }

  if (user.lastName.length) {
    nameInitials += user.lastName[0];
  }

  return nameInitials;
};
