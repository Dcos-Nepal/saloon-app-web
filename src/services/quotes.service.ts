import { generateQueryParams } from "utils";
import { http } from "utils/http";

export const fetchQuotesApi = async (query: Record<string, any>) => {
  const url = "v1.0.0/quotes" + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}
