import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const fetchQuotesApi = async (query: Record<string, any>) => {
  const url = '/v1/appointments' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const createQuotesApi = async (payload: any) => {
  const url = '/v1/appointments';
  return await http.post(url, payload, {
    headers: { Accept: 'application/json' }
  });
};

export const deleteQuoteApi = async (id: string) => {
  const url = '/v1/appointments/' + id;
  return await http.delete(url);
};

export const fetchJobQuoteApi = async (payload: any) => {
  const url = `/v1/appointments/${payload.id}`;
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const updateQuoteApi = async (payload: any) => {
  const url = `/v1/appointments/${payload.id}`;
  return await http.put(url, payload.data, {
    headers: { Accept: 'application/json' }
  });
};

export const updateQuoteStatusApi = async (payload: any) => {
  const url = `/v1/appointments/${payload.id}`;
  return await http.patch(url, payload.data, {
    headers: { Accept: 'application/json' }
  });
};

export const getQuotesSummaryApi = async (query: any) => {
  const url = '/v1/appointments/summary' + (query ? `?${generateQueryParams(query)}` : '');;
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};
