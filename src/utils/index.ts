import { getData } from "./storage";

/**
 * Generates Query params using the given object.
 *
 * @param params Record<string, any>
 * @returns String
 */
export const generateQueryParams = (params: Record<string, any>): string => {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

/**
 * Get current logged in user
 *
 * @returns User | null
 */
export const getCurrentUser = () => {
  const currentUser = getData('user');

  if (currentUser) {
    return { id: currentUser._id, role: currentUser.roles[0] };
  }

  return { role: '', id: '' };
}

export const getHashValues = (hash: any) => {
  // Needs modern browser
  return Object.values(hash);
}

export const hashById = (array: any[]) => {
  let hash: any = {};

  for (let item of array) {
    hash[item.id] = item;
  }

  return hash;
}

export const excludeById = (array: any[], id: string) => {
  return array.filter((item) => item.id !== id)
}

export const getTodayStr = () => {
  return new Date().toISOString().replace(/T.*$/, '')
}

/**
 * Generates sample UUID
 * @returns string
 */
 export const getUuid = (): string => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * Get Property Address
 * @param job 
 * @returns 
 */
 export const getPropertyAddress = (property: any) => {
  const addressStack = [];
  
  if (property?.street1) addressStack.push(property?.street1);
  if (property?.street2) addressStack.push(property?.street2);
  if (property?.city) addressStack.push(property?.city);
  if (property?.postalCode) addressStack.push(property?.postalCode);
  if (property?.country) addressStack.push(property?.country);

  return addressStack.join(', ');
}

/**
 * Get Job's Property
 * @param job 
 * @returns 
 */
export const getJobPropertyAddress = (job: any) => {
  let property = (job?.property) ? job?.property : job?.jobFor?.address;
  return getPropertyAddress(property);
}
