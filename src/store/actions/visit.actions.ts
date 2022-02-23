import { ADD_VISIT, FETCH_VISITS, FETCH_VISIT, UPDATE_VISIT } from 'store/constants';

export const fetchVisits = (data: any) => {
  return {
    type: FETCH_VISITS,
    payload: data
  };
};

export const fetchVisit = (id: string, params: any) => {
  return {
    type: FETCH_VISIT,
    payload: { id, params }
  };
};

export const createVisits = (data: any) => {
  return {
    type: ADD_VISIT,
    payload: data
  };
};

export const updateVisit = (id: string, data: any) => {
  return {
    type: UPDATE_VISIT,
    payload: { id, data }
  };
};
