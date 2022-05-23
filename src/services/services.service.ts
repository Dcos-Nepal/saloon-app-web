import { http } from 'utils/http';
import { generateQueryParams } from 'utils';

export const fetchServicesApi = async (query: Record<string, any>) => {
  const url = '/v1/services' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const addServiceApi = async (payload: any) => {
  const url = '/v1/services';
  return await http.post(url, payload);
};

export const deleteServiceApi = async (id: string) => {
  const url = '/v1/services/' + id;
  return await http.delete(url);
};

export const fetchServiceApi = async (id: string) => {
  const url = '/v1/services/' + id;
  return await http.get(url);
};

export const updateServiceApi = async (payload: any) => {
  const url = '/v1/services/' + payload._id;
  return await http.patch(url, payload);
};
