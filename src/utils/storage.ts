/**
 * Set data in the local storage
 * @param key 
 * @param data 
 * @returns 
 */
export const setData = async (key: string, data: string) => {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

/**
 * Get data from local storage
 * @param key 
 * @returns 
 */
export const getData: any = (key: string) => {
  const data: any = localStorage.getItem(key);
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (err) {
    parsedData = data;
  }
  return parsedData;
};

/**
 * Deletes data from local storage
 * @param key 
 * @returns 
 */
 export const deleteData = (key: string) => {
  return localStorage.removeItem(key);
};

/**
 * Clears local storage
 * @returns 
 */
export const clearData = () => localStorage.clear();
