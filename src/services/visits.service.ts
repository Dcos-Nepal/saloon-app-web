import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const fetchVisitsApi = async (query: Record<string, any>) => {
  const url = '/v1.0.0/visits' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url);
};

export const fetchVisitApi = async (id: string) => {
  const url = '/v1.0.0/visits/' + id;
  return await http.get(url);
};

export const updateVisitApi = async (id: string, payload: any) => {
  const url = '/v1.0.0/visits/' + id;
  return await http.put(url, payload);
};

export const updateStatus = async (id: string, payload: any) => {
  const url = '/v1.0.0/visits/' + id + '/update-status';
  return await http.put(url, payload);
};

export const addVisitApi = async (payload: any) => {
  const url = '/v1.0.0/visits';
  return await http.post(url, payload);
};
