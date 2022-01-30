import { generateQueryParams } from "utils";
import { http } from "utils/http";

export const fetchJobRequestsApi = async (query: Record<string, any>) => {
  const url =
    "/v1.0.0/job-requests" + (query ? `?${generateQueryParams(query)}` : "");
  return await http.get(url, {
    headers: { Accept: "application/json" },
  });
};

export const addJobRequestApi = async (payload: any) => {
  const url = "/v1.0.0/job-requests";
  return await http.post(url, payload);
};
