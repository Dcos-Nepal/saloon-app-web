import { http } from 'utils/http';
import { generateQueryParams } from 'utils';

export const fetchLineItemsApi = async (query: Record<string, any>) => {
  const url = '/v1/line-items' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const addLineItemApi = async (payload: any) => {
  const url = '/v1/line-items';
  return await http.post(url, payload);
};

export const deleteLineItemApi = async (id: string) => {
  const url = '/v1/line-items/' + id;
  return await http.delete(url);
};

export const fetchLineItemApi = async (id: string) => {
  const url = '/v1/line-items/' + id;
  return await http.get(url);
};

export const updateLineItemApi = async (payload: any) => {
  const url = '/v1/line-items/' + payload._id;
  return await http.patch(url, payload);
};
