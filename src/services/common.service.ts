import { generateQueryParams } from "utils";
import { http } from "utils/http";

export const filterApi = async (resource: string, query: Record<string, any>) => {
  const url = `/v1.0.0/${resource}` + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}
