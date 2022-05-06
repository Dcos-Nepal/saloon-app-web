import { http } from 'utils/http';
import { generateQueryParams } from 'utils';

export const fetchPropertiesApi = async (query: Record<string, any>) => {
  const url = '/v1/properties' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const fetchPropertyApi = async (id: string) => {
  const url = '/v1/properties/' + id;
  return await http.get(url);
};

export const updatePropertyApi = async (payload: any) => {
  const url = '/v1/properties/' + payload._id;
  return await http.put(url, payload);
};

export const addPropertyApi = async (payload: any) => {
  const url = '/v1/properties';
  return await http.post(url, payload);
};
