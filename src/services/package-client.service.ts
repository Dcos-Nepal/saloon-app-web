import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const fetchPackageClientsApi = async (query: Record<string, any>) => {
  const url = '/v1/package-clients' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url);
};

export const fetchPackageClientApi = async (id: string) => {
  const url = '/v1/package-clients/' + id;
  return await http.get(url);
};

export const getPackageClientSummaryApi = async (query: { startDate: string; endDate: string }) => {
  const url = `/v1/package-clients/summary?${generateQueryParams(query)}`;
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const updatePackageClientApi = async (id: string, payload: any, query: any = null) => {
  const url = `/v1/package-clients/${id}` + (query ? `?${generateQueryParams(query)}` : '');
  return await http.put(url, payload);
};

export const addPackageClientApi = async (payload: any, query: any = null) => {
  const url = '/v1/package-clients' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.post(url, payload);
};

export const deletePackageClientApi = async (id: string) => {
  const url = '/v1/package-clients/' + id;
  return await http.delete(url);
};

export const completePackageClientApi = async (id: string, data: any) => {
  const url = `/v1/package-clients/${id}/approve`;
  return await http.put(url, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
