import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const fetchQuotesApi = async (query: Record<string, any>) => {
  const url = '/v1.0.0/quotes' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const createQuotesApi = async (payload: any) => {
  const url = '/v1.0.0/quotes';
  return await http.post(url, payload, {
    headers: { Accept: 'application/json' }
  });
};

export const deleteQuoteApi = async (id: string) => {
  const url = '/v1.0.0/quotes/' + id;
  return await http.delete(url);
};

export const fetchJobQuoteApi = async (payload: any) => {
  const url = `/v1.0.0/quotes/${payload.id}`;
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const updateQuoteApi = async (payload: any) => {
  const url = `/v1.0.0/quotes/${payload.id}`;
  return await http.put(url, payload.data, {
    headers: { Accept: 'application/json' }
  });
};

export const updateQuoteStatusApi = async (payload: any) => {
  const url = `/v1.0.0/quotes/${payload.id}/update-status`;
  return await http.put(
    url,
    { status: payload.data },
    {
      headers: { Accept: 'application/json' }
    }
  );
};

export const getQuotesSummaryApi = async () => {
  const url = '/v1.0.0/quotes/summary';
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};
