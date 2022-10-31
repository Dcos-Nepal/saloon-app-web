import { http } from 'utils/http';
import { generateQueryParams } from 'utils';

export const fetchSchedulesApi = async (query: Record<string, any>) => {
  const url = '/v1/bookings' + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { Accept: 'application/json' }
  });
};
