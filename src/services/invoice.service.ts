import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const createInvoiceApi = async (payload: any) => {
  const url = '/v1/invoices';
  return await http.post(url, payload, {
    headers: { Accept: 'application/json' }
  });
};

export const sendInvoiceApi = async (id: string) => {
  const url = '/v1/invoices/' + id + '/send';
  return await http.post(
    url,
    {},
    {
      headers: { Accept: 'application/json' }
    }
  );
};

export const deleteInvoiceApi = async (id: string) => {
  const url = '/v1/invoices/' + id;
  return await http.delete(url);
};

export const fetchInvoicesApi = async (query: Record<string, any>) => {
  const url = '/v1/invoices' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const fetchInvoiceApi = async (payload: { id: string }) => {
  const url = '/v1/invoices/' + payload.id;
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};

export const updateInvoiceApi = async (payload: any) => {
  const url = `/v1/invoices/${payload.id}`;
  return await http.put(url, payload.data, {
    headers: { Accept: 'application/json' }
  });
};
