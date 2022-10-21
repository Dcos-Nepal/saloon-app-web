import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const fetchUsersApi = async (query: Record<string, any>) => {
  const url = '/v1/customers' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const addUserApi = async (payload: any) => {
  const url = '/v1/customers';
  return await http.post(url, payload);
};

export const deleteUserApi = async (id: string) => {
  const url = '/v1/customers/' + id;
  return await http.delete(url);
};

export const fetchUserApi = async (id: string) => {
  const url = '/v1/customers/' + id;
  return await http.get(url);
};

export const updateUserApi = async (payload: any) => {
  const url = '/v1/customers/' + payload.id;
  return await http.patch(url, payload.data);
};

export const approveWorkerApi = async (payload: string) => {
  const url = '/v1/customers/' + payload + '/approve';
  return await http.get(url);
};

export const filterUsersApi = async (query: Record<string, any>) => {
  const url = '/v1/customers' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const getUsersSummaryApi = async () => {
  const url = '/v1/customers/summary';
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};
