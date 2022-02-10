import { generateQueryParams } from "utils";
import { http } from "utils/http";

export const fetchQuotesApi = async (query: Record<string, any>) => {
  const url = "/v1.0.0/quotes" + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}

export const createQuotesApi = async (payload: any) => {
  const url = "/v1.0.0/quotes";
  return await http.post(url, payload);
};


export const updateQuoteApi = async (payload: any) => {
  const url = `/v1.0.0/quotes/${payload.id}/update-status`;
  return await http.put(url, {status: payload.status});
};
