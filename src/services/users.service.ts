import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const fetchUsersApi = async (query: Record<string, any>) => {
  const url = '/v1.0.0/users' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const addUserApi = async (payload: any) => {
  const url = '/v1.0.0/users';
  return await http.post(url, payload);
};

export const deleteUserApi = async (id: string) => {
  const url = '/v1.0.0/users/' + id;
  return await http.delete(url);
};

export const fetchUserApi = async (id: string) => {
  const url = '/v1.0.0/users/' + id;
  return await http.get(url);
};

export const updateUserApi = async (payload: any) => {
  const url = '/v1.0.0/users/' + payload._id;
  return await http.put(url, payload);
};

export const filterUsersApi = async (query: Record<string, any>) => {
  const url = '/v1.0.0/users' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const getUsersSummaryApi = async () => {
  const url = '/v1.0.0/users/summary';
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};
