import { addDays } from 'date-fns';
const getISODateFrom = num => addDays(new Date(), num).toISOString();

export const BASE_API_URL = 'https://api.sledilnik.org';

const BASE_TIMESTAMP_URL =
  'https://raw.githubusercontent.com/sledilnik/data/master/csv';

export const API_URL = {
  SUMMARY: `${BASE_API_URL}/api/summary`,
  PATIENTS: `${BASE_API_URL}/api/patients`,
  STATS: `${BASE_API_URL}/api/stats`,
  HOSPITALS_LIST: `${BASE_API_URL}/api/hospitals-list`,
  MUN: `${BASE_API_URL}/api/municipalities`,
};

export const API_PARAMS = {
  PATIENTS: { from: getISODateFrom(-3) },
  STATS: { from: getISODateFrom(-4) },
  MUN: { from: getISODateFrom(-18) },
};
export const TIMESTAMP_URL = {
  LAB_TESTS: `${BASE_TIMESTAMP_URL}/lab-tests.csv.timestamp`,
  CASES: `${BASE_TIMESTAMP_URL}/cases.csv.timestamp`,
  PATIENTS: `${BASE_TIMESTAMP_URL}/patients.csv.timestamp`,
  STATS: `${BASE_TIMESTAMP_URL}/stats.csv.timestamp`,
  MUN: `${BASE_TIMESTAMP_URL}/municipality-confirmed.csv.timestamp`,
};

export default {
  BASE_API_URL,
  API_URL,
  API_PARAMS,
  TIMESTAMP_URL,
};
