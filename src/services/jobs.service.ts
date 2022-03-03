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

export const getJobsSummaryApi = async (query: any) => {
  const url = '/v1.0.0/jobs/summary' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
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

export const updateJobApi = async (id: string, payload: any) => {
  const url = `/v1.0.0/jobs/${id}`;
  return await http.put(url, payload);
};

export const provideFeedbackApi = async (
  id: string,
  data: {
    rating: number;
    note?: string;
    date?: any;
  }
) => {
  const url = `/v1.0.0/jobs/${id}/feedback`;
  return await http.put(url, data);
};

export const completeJobApi = async (id: string, data: any) => {
  const url = `/v1.0.0/jobs/${id}/complete`;
  return await http.put(url, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteJobApi = async (id: string) => {
  const url = '/v1.0.0/jobs/' + id;
  return await http.delete(url);
};
