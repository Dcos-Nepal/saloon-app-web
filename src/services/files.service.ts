import { http } from "utils/http";

/**
 * Upload public file
 * @param data Object
 * @returns Promise
 */
export const uploadPublicFile = async (data: any) => {
  return await http.post("/v1/files/public", data, {
    headers: { "Accept": "application/json" }
  });
}

/**
 * Delete public file
 * @param key String
 * @returns Promise
 */
export const deletePublicFile = async (key: string) => {
  return await http.delete(`/v1/files/public/${key}`);
}
