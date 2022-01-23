import { generateQueryParams } from "utils";
import { http } from "utils/http";

export const fetchUsersApi = async (query: Record<string, any>) => {
  const url = "v1.0.0/users" + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}
