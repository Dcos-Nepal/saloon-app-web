import { generateQueryParams } from "utils";
import { http } from "utils/http";

export const fetchUsersApi = async (query: Record<string, any>) => {
  const url = "/v1.0.0/users" + (query ? `?${generateQueryParams(query)}` : "");
  return await http.get(url, {
    headers: { Accept: "application/json" },
  });
};

export const addUserApi = async (payload: any) => {
  const url = "/v1.0.0/auth/register";
  return await http.post(url, payload);
};

export const filterUsersApi = async (query: Record<string, any>) => {
  const url = "/v1.0.0/users" + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}
