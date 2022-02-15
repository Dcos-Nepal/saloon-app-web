import { IUser } from 'common/types/user';
import { ADD_PROPERTY, FETCH_PROPERTY, FETCH_PROPERTIES, UPDATE_PROPERTY } from 'store/constants';

export const fetchProperties = (data: any) => {
  return {
    type: FETCH_PROPERTIES,
    payload: data
  };
};

export const addProperty = (data: any) => {
  return {
    type: ADD_PROPERTY,
    payload: data
  };
};

export const fetchProperty = (id: string) => {
  return {
    type: FETCH_PROPERTY,
    payload: id
  };
};

export const updateProperty = (data: IUser) => {
  return {
    type: UPDATE_PROPERTY,
    payload: data
  };
};
