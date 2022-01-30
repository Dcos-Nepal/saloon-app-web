import { generateQueryParams } from "utils";
import { http } from "utils/http";

export const filterLineItemsApi = async (query: Record<string, any>) => {
  const url = "/v1.0.0/line-items" + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}
