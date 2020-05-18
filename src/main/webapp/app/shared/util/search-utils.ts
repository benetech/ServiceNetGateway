import { Storage } from 'react-jhipster';

export const ORDER_DESC = 'desc';
export const ORDER_ASC = 'asc';
export const DEFAULT_SORT_ORDER = ORDER_DESC;
const SORT_SIMILARITY = 'similarity';
const SORT_RECENTLY_UPDATED = 'recent';
const SORT_RECOMMENDED = 'recommended';
const SORT_NAME = 'name';
const SORT_UPDATED_AT = 'updatedAt';
export const SORT_ARRAY = [SORT_SIMILARITY, SORT_RECENTLY_UPDATED, SORT_RECOMMENDED];
const SORT_BEDS = 'beds';
const SORT_DISTANCE = 'distance';
export const SHELTER_SORT_ARRAY = [SORT_BEDS, SORT_DISTANCE];
export const PROVIDER_SORT_ARRAY = [SORT_UPDATED_AT, SORT_NAME];

const defaultSearchPreferences = {
  sort: SORT_SIMILARITY,
  order: DEFAULT_SORT_ORDER,
  searchPhrase: '',
  shelterSearchPreferences: {
    sort: SORT_BEDS,
    order: DEFAULT_SORT_ORDER,
    searchPhrase: ''
  },
  providerSearchPreferences: {
    sort: SORT_UPDATED_AT,
    order: DEFAULT_SORT_ORDER
  }
};

export const getSearchPreferences = username => {
  if (!username) {
    return defaultSearchPreferences;
  }
  const searchPreferences = Storage.local.get(username, defaultSearchPreferences);
  if (!searchPreferences.hasOwnProperty('shelterSearchPreferences') || !searchPreferences.hasOwnProperty('providerSearchPreferences')) {
    resetSearchPreferences(username);
    return defaultSearchPreferences;
  }
  return searchPreferences;
};

export const resetSearchPreferences = username => {
  Storage.local.set(username, defaultSearchPreferences);
};

export const setSort = (username, sort, order) => {
  const searchPreferences = Storage.local.get(username, defaultSearchPreferences);
  Storage.local.set(username, { ...searchPreferences, sort, order });
};

export const setSearchPhrase = (username, searchPhrase) => {
  const searchPreferences = Storage.local.get(username, defaultSearchPreferences);
  Storage.local.set(username, { ...searchPreferences, searchPhrase });
};

export const setShelterSort = (username, sort) => {
  const searchPreferences = Storage.local.get(username, defaultSearchPreferences);
  searchPreferences.shelterSearchPreferences.sort = sort;
  Storage.local.set(username, searchPreferences);
};

export const setProviderSort = (username, sort, order) => {
  const searchPreferences = Storage.local.get(username, defaultSearchPreferences);
  searchPreferences.providerSearchPreferences.sort = sort;
  searchPreferences.providerSearchPreferences.order = order;
  Storage.local.set(username, searchPreferences);
};

export const setShelterSearchPhrase = (username, searchPhrase) => {
  const searchPreferences = Storage.local.get(username, defaultSearchPreferences);
  searchPreferences.shelterSearchPreferences.searchPhrase = searchPhrase;
  Storage.local.set(username, searchPreferences);
};
