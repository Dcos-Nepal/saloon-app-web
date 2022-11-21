import { generateQueryParams } from 'utils';
import { http } from 'utils/http';

export const createOrdersApi = async (payload: any) => {
    const url = '/v1/orders';
    return await http.post(url, payload, {
        headers: { Accept: 'application/json' }
    });
};

export const fetchOrdersApi = async (query: Record<string, any>) => {
    const url = '/v1/orders' + (query ? `?${generateQueryParams(query)}` : '');
    return await http.get(url, {
        headers: { Accept: 'application/json' }
    });
};

export const deleteOrderApi = async (id: string) => {
    const url = '/v1/orders/' + id;
    return await http.delete(url);
};

export const fetchJobOrderApi = async (payload: any) => {
    const url = `/v1/orders/${payload.id}`;
    return await http.get(url, { headers: { Accept: 'application/json' } });
};

export const updateOrderApi = async (payload: any) => {
    const url = `/v1/orders/${payload.id}`;
    return await http.put(url, payload.data, { headers: { Accept: 'application/json' } });
};

export const updateOrderStatusApi = async (payload: any) => {
    const url = `/v1/orders/${payload.id}`;
    return await http.patch(url, payload.data, { headers: { Accept: 'application/json' }});
};
