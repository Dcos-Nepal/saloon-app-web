import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const fetchJobsApi = async (query: Record<string, any>) => {
  const url = '/v1.0.0/jobs' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const addJobApi = async (payload: any) => {
  const url = '/v1.0.0/jobs';
  return await http.post(url, payload);
};

export const fetchJobApi = async (id: string) => {
  const url = '/v1.0.0/jobs/' + id;
  return await http.get(url);
};

export const filterJobsApi = async (query: Record<string, any>) => {
  const url = '/v1.0.0/jobs' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const updateJobApi = async (payload: any) => {
  const url = `/v1.0.0/jobs/${payload.id}`;

  return await http.put(url, payload, {
    headers: { Accept: 'application/json' }
  });
};
