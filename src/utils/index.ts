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

export const isDateBefore =(date1: Date | string, date2: Date | string) => {
  return new Date(date1) < new Date(date2);
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
 * Format Address
 * @param address  Address
 * @returns String
 */
export const formatAddress = (address: { street1?: string; street2?: string; city?: string; postalCode?: string; country?: string }) => {
  if (!address) {
    return '';
  }

  const addressStack = [];

  if (address?.street1) addressStack.push(address?.street1);
  if (address?.street2) addressStack.push(address?.street2);
  if (address?.city) addressStack.push(address?.city);
  if (address?.postalCode) addressStack.push(address?.postalCode);
  if (address?.country) addressStack.push(address?.country);

  return addressStack.join(', ');
};

/**
 * Get Job's Address
 * @param job Job
 * @returns String
 */
export const getJobAddress = (job: any) => {
  console.log(job?.property)
  let property = (job?.property) ? job?.property : job?.jobFor?.address;
  return formatAddress(property);
}
