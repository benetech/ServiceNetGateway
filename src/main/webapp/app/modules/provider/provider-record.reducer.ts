import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVICENET_API_URL, SERVICENET_PUBLIC_API_URL } from 'app/shared/util/service-url.constants';
import _ from 'lodash';
import { ISimpleOrganization } from 'app/shared/model/simple-organization.model';
import { IOrganizationOption } from 'app/shared/model/organization-option.model';

export const ACTION_TYPES = {
  FETCH_RECORDS: 'records/FETCH_RECORDS',
  FETCH_ALL_RECORDS: 'records/FETCH_ALL_RECORDS',
  FETCH_PROVIDER_OPTIONS: 'records/FETCH_PROVIDER_OPTIONS',
  FETCH_ALL_RECORDS_FOR_MAP: 'records/FETCH_ALL_RECORDS_FOR_MAP',
  FETCH_RECORDS_AVAILABLE_TO_CLAIM: 'records/FETCH_RECORDS_AVAILABLE_TO_CLAIM',
  SELECT_RECORD: 'records/SELECT_RECORD',
  REFER_RECORD: 'records/REFER_RECORD',
  UNREFER_RECORD: 'records/UNREFER_RECORD',
  MARK_RECORD_TO_CLAIM: 'records/MARK_RECORD_TO_CLAIM',
  UNMARK_RECORD_TO_CLAIM: 'records/UNMARK_RECORD_TO_CLAIM',
  RESET_RECORDS_TO_CLAIM: 'records/RESET_RECORDS_TO_CLAIM',
  CLEAN_REFERRED_RECORDS: 'records/CLEAN_REFERRED_RECORDS',
  CHECK_IN: 'records/CHECK_IN',
  RESET_CHECKED_IN: 'records/RESET_CHECKED_IN',
  SEND_REFERRALS: 'records/SEND_REFERRALS',
  FETCH_MADE_TO_OPTIONS: 'records/FETCH_MADE_TO_OPTIONS'
};

const initialState = {
  loading: false,
  errorMessage: null,
  updating: false,
  updateSuccess: false,
  records: [] as any[],
  recordsByIndex: {},
  recordsTotal: 0,
  allRecords: [] as any[],
  allRecordsForMap: [] as any[],
  allRecordsTotal: 0,
  selectedRecord: null,
  referredRecords: new Map<string, any>(),
  userName: '',
  checkedIn: false,
  referSuccess: false,
  providerOptions: [] as ReadonlyArray<IOrganizationOption>,
  madeToOptions: [] as ReadonlyArray<IOrganizationOption>,
  recordsAvailableToClaim: [] as any[],
  recordsAvailableToClaimTotal: 0,
  recordsToClaim: [] as any[]
};

const DEFAULT_RECORDS_SORT = 'updatedAt,desc';

export type ProviderRecordsState = Readonly<typeof initialState>;

const addPage = (records, page) => {
  _.forEach(page.content, (record, i) => {
    records[page.size * page.number + i] = record;
  });
  return { ...records };
};

// Reducer
export default (state: ProviderRecordsState = initialState, action): ProviderRecordsState => {
  const referredRecords = new Map(state.referredRecords);
  const { recordsToClaim } = state;
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RECORDS):
    case REQUEST(ACTION_TYPES.FETCH_ALL_RECORDS):
    case REQUEST(ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP):
    case REQUEST(ACTION_TYPES.FETCH_RECORDS_AVAILABLE_TO_CLAIM):
      return {
        ...state,
        selectedRecord: null,
        loading: true
      };
    case REQUEST(ACTION_TYPES.SELECT_RECORD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case REQUEST(ACTION_TYPES.CHECK_IN):
      return {
        ...state,
        checkedIn: false
      };
    case REQUEST(ACTION_TYPES.SEND_REFERRALS):
      return {
        ...state,
        referSuccess: false
      };
    case FAILURE(ACTION_TYPES.FETCH_RECORDS):
    case FAILURE(ACTION_TYPES.FETCH_ALL_RECORDS):
    case FAILURE(ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP):
    case FAILURE(ACTION_TYPES.SELECT_RECORD):
    case FAILURE(ACTION_TYPES.SEND_REFERRALS):
    case FAILURE(ACTION_TYPES.FETCH_RECORDS_AVAILABLE_TO_CLAIM):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        referSuccess: false,
        errorMessage: action.payload
      };
    case FAILURE(ACTION_TYPES.CHECK_IN):
      return {
        ...state,
        checkedIn: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECORDS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        records: action.payload.data.content,
        recordsByIndex: addPage(state.recordsByIndex, action.payload.data),
        recordsTotal: action.payload.data.totalElements,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_ALL_RECORDS):
      const { isInitLoading } = action.meta;
      const payload = isInitLoading ? action.payload.data : [...state.allRecords, ...action.payload.data];
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        allRecords: payload,
        allRecordsTotal: action.payload.headers['x-total-count'],
        loading: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        allRecordsForMap: action.payload.data,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECORDS_AVAILABLE_TO_CLAIM):
      const availableToClaimpayload = action.meta.isInitLoading
        ? action.payload.data.content
        : [...state.recordsAvailableToClaim, ...action.payload.data.content];
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        recordsAvailableToClaim: availableToClaimpayload,
        recordsAvailableToClaimTotal: action.payload.data.totalElements,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.SELECT_RECORD):
      return {
        ...state,
        selectedRecord: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CHECK_IN):
      return {
        ...state,
        checkedIn: true
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROVIDER_OPTIONS):
      return {
        ...state,
        providerOptions: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_MADE_TO_OPTIONS):
      return {
        ...state,
        madeToOptions: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SEND_REFERRALS):
      return {
        ...state,
        referredRecords: new Map(),
        referSuccess: true
      };
    case ACTION_TYPES.REFER_RECORD:
      referredRecords.set(action.payload.organization.id, action.payload);
      return {
        ...state,
        referredRecords,
        userName: action.meta.userName
      };
    case ACTION_TYPES.UNREFER_RECORD:
      referredRecords.delete(action.payload.organization.id);
      return {
        ...state,
        referredRecords,
        userName: action.meta.userName
      };
    case ACTION_TYPES.MARK_RECORD_TO_CLAIM:
      recordsToClaim.push(action.payload);
      return {
        ...state,
        recordsToClaim: [...recordsToClaim]
      };
    case ACTION_TYPES.UNMARK_RECORD_TO_CLAIM:
      _.remove(recordsToClaim, r => r === action.payload);
      return {
        ...state,
        recordsToClaim: [...recordsToClaim]
      };
    case ACTION_TYPES.CLEAN_REFERRED_RECORDS:
      return {
        ...state,
        referredRecords: new Map(),
        userName: ''
      };
    case ACTION_TYPES.RESET_CHECKED_IN:
      return {
        ...state,
        checkedIn: false
      };
    case ACTION_TYPES.RESET_RECORDS_TO_CLAIM:
      return {
        ...state,
        recordsToClaim: []
      };
    default:
      return state;
  }
};

const userRecordApiUrl = SERVICENET_API_URL + '/provider-records';
const providerOptionsApiUrl = SERVICENET_API_URL + '/provider-record-options';
const allRecordApiUrl = SERVICENET_API_URL + '/all-provider-records';
const allRecordPublicApiUrl = SERVICENET_PUBLIC_API_URL + '/all-provider-records';
const allRecordForMapApiUrl = SERVICENET_API_URL + '/all-provider-records-map';
const selectRecordApiUrl = SERVICENET_API_URL + '/select-record';
const allRecordForMapPublicApiUrl = SERVICENET_PUBLIC_API_URL + '/all-provider-records-map';
const selectRecordPublicApiUrl = SERVICENET_PUBLIC_API_URL + '/select-record';
const checkInApiUrl = SERVICENET_API_URL + '/beneficiaries/check-in';
const referUrl = SERVICENET_API_URL + '/beneficiaries/refer';
const madeToOptionsApiUrl = SERVICENET_API_URL + '/referrals/made-to-options';
const recordsAvailableToClaimApiUrl = SERVICENET_API_URL + '/records-to-claim';

// Actions

export const getProviderRecords = (page, itemsPerPage, sort = DEFAULT_RECORDS_SORT) => {
  const pageableUrl = `${userRecordApiUrl}?page=${page}&size=${itemsPerPage}&sort=${sort}`;
  return {
    type: ACTION_TYPES.FETCH_RECORDS,
    payload: axios.get(pageableUrl)
  };
};

export const getProviderOptions = () => ({
  type: ACTION_TYPES.FETCH_PROVIDER_OPTIONS,
  payload: axios.get(providerOptionsApiUrl)
});

export const getAllProviderRecords = (page, itemsPerPage, sort, filter, search, isInitLoading = true) => {
  const pageableUrl = `${allRecordApiUrl}?search=${search ? search : ''}&page=${page}&size=${itemsPerPage}&sort=${sort}`;
  return {
    type: ACTION_TYPES.FETCH_ALL_RECORDS,
    payload: axios.post(pageableUrl, clearFilter(filter)),
    meta: {
      isInitLoading
    }
  };
};

export const getAllProviderRecordsPublic = (silo, page, itemsPerPage, sort, filter, search, isInitLoading = true) => {
  const pageableUrl = `${allRecordPublicApiUrl}/${silo}?search=${search ? search : ''}&page=${page}&size=${itemsPerPage}&sort=${sort}`;
  return {
    type: ACTION_TYPES.FETCH_ALL_RECORDS,
    payload: axios.post(pageableUrl, clearFilter(filter)),
    meta: {
      isInitLoading
    }
  };
};

export const getProviderRecordsForMap = (siloName = '', providerFilter, search, boundaries, itemsPerPage) => {
  const params = `size=${itemsPerPage}&search=${search ? search : ''}&boundaries=${boundaries ? boundaries.toUrlValue() : ''}`;
  const baseUrl = siloName ? `${allRecordForMapPublicApiUrl}?siloName=${siloName}&${params}` : `${allRecordForMapApiUrl}?${params}`;
  return {
    type: ACTION_TYPES.FETCH_ALL_RECORDS_FOR_MAP,
    payload: axios.post(baseUrl, clearFilter(providerFilter))
  };
};

export const selectRecord = (id, siloName = '') => {
  const baseUrl = siloName ? selectRecordPublicApiUrl : selectRecordApiUrl;
  return {
    type: ACTION_TYPES.SELECT_RECORD,
    payload: axios.get(`${baseUrl}/${id}?siloName=${siloName}`)
  };
};

const clearFilter = filter => ({
  ...filter,
  serviceTypes: _.map(filter.serviceTypes, s => s.value)
});

export const referRecord = (record, userName = '') => ({
  type: ACTION_TYPES.REFER_RECORD,
  payload: record,
  meta: { userName }
});

export const unreferRecord = (record, userName = '') => ({
  type: ACTION_TYPES.UNREFER_RECORD,
  payload: record,
  meta: { userName }
});

export const cleanReferredRecords = () => ({
  type: ACTION_TYPES.CLEAN_REFERRED_RECORDS
});

export const checkIn = (phoneNumber, beneficiaryId, cboId, locationId) => ({
  payload: axios.post(checkInApiUrl, { phoneNumber, beneficiaryId, cboId, locationId }),
  type: ACTION_TYPES.CHECK_IN
});

export const resetCheckedIn = () => ({
  type: ACTION_TYPES.RESET_CHECKED_IN
});

export const sendReferrals = (cboId: string, referrals: any, fromLocation: string, phone = '', beneficiaryId = '') => {
  const url =
    `${referUrl}?referringOrganizationId=${cboId ? cboId : ''}&referringLocationId=${fromLocation ? fromLocation : ''}` +
    `&phoneNumber=${phone ? encodeURIComponent(phone) : ''}&beneficiaryId=${beneficiaryId ? beneficiaryId : ''}`;
  return {
    type: ACTION_TYPES.SEND_REFERRALS,
    payload: axios.post(url, referrals)
  };
};

export const getMadeToOptions = () => ({
  type: ACTION_TYPES.FETCH_MADE_TO_OPTIONS,
  payload: axios.get(madeToOptionsApiUrl)
});

export const getRecordsAvailableToClaim = (page, itemsPerPage, isInitLoading = false) => {
  const pageableUrl = `${recordsAvailableToClaimApiUrl}?page=${page}&size=${itemsPerPage}&sort=${DEFAULT_RECORDS_SORT}`;
  return {
    type: ACTION_TYPES.FETCH_RECORDS_AVAILABLE_TO_CLAIM,
    payload: axios.get(pageableUrl),
    meta: {
      isInitLoading
    }
  };
};

export const markRecordToClaim = recordId => ({
  type: ACTION_TYPES.MARK_RECORD_TO_CLAIM,
  payload: recordId
});

export const unmarkRecordToClaim = recordId => ({
  type: ACTION_TYPES.UNMARK_RECORD_TO_CLAIM,
  payload: recordId
});

export const resetRecordsToClaim = () => ({
  type: ACTION_TYPES.RESET_RECORDS_TO_CLAIM
});
