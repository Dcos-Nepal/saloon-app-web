import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const fetchJobRequestsApi = async (query: Record<string, any>) => {
  const url = '/v1/job-requests' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const addJobRequestApi = async (payload: any) => {
  const url = '/v1/job-requests';
  return await http.post(url, payload);
};

export const fetchJobRequestApi = async (id: string) => {
  const url = '/v1/job-requests/' + id;
  return await http.get(url);
};

export const deleteJobRequestApi = async (id: string) => {
  const url = '/v1/job-requests/' + id;
  return await http.delete(url);
};

export const updateJobRequestApi = async (payload: any) => {
  const url = '/v1/job-requests/' + payload._id;
  return await http.put(url, payload);
};

export const getJobRequestsSummaryApi = async (query: any) => {
  const url = '/v1/job-requests/summary' + (query ? `?${generateQueryParams(query)}` : '');;
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};
