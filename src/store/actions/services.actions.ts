import { FETCH_SERVICES } from 'store/constants';

export const fetchServices = (data: any) => {
  return {
    type: FETCH_SERVICES,
    payload: data
  };
};

