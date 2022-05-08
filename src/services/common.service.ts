import { generateQueryParams } from "utils";
import { http } from "utils/http";

export const filterApi = async (resource: string, query: Record<string, any>) => {
  const url = `/v1/${resource}` + (query ? `?${generateQueryParams(query)}` : '');
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}

export const fetchUserProperties = async (userId: string) => {
  const url = `/v1/users/${userId}/properties`;
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}

export const fetchJobVisits = async (jobId: string) => {
  const url = `/v1/visits?job=${jobId}`;
  return await http.get(url, {
    headers: { "Accept": "application/json" }
  });
}
