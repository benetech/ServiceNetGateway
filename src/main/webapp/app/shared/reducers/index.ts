import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import scheduler, { SchedulerState } from 'app/modules/administration/scheduler/scheduler.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import systemAccount, {
SystemAccountState
 } from 'app/entities/system-account/system-account.reducer';
// prettier-ignore
import documentUpload, {
DocumentUploadState
 } from 'app/entities/document-upload/document-upload.reducer';
// prettier-ignore
import organization, {
OrganizationState
 } from 'app/entities/organization/organization.reducer';
// prettier-ignore
import service, {
ServiceState
 } from 'app/entities/service/service.reducer';
// prettier-ignore
import program, {
ProgramState
 } from 'app/entities/program/program.reducer';
// prettier-ignore
import serviceAtLocation, {
ServiceAtLocationState
 } from 'app/entities/service-at-location/service-at-location.reducer';
// prettier-ignore
import location, {
LocationState
 } from 'app/entities/location/location.reducer';
// prettier-ignore
import physicalAddress, {
PhysicalAddressState
 } from 'app/entities/physical-address/physical-address.reducer';
// prettier-ignore
import postalAddress, {
PostalAddressState
 } from 'app/entities/postal-address/postal-address.reducer';
// prettier-ignore
import phone, {
PhoneState
 } from 'app/entities/phone/phone.reducer';
// prettier-ignore
import contact, {
ContactState
 } from 'app/entities/contact/contact.reducer';
// prettier-ignore
import regularSchedule, {
RegularScheduleState
 } from 'app/entities/regular-schedule/regular-schedule.reducer';
// prettier-ignore
import holidaySchedule, {
HolidayScheduleState
 } from 'app/entities/holiday-schedule/holiday-schedule.reducer';
// prettier-ignore
import funding, {
FundingState
 } from 'app/entities/funding/funding.reducer';
// prettier-ignore
import eligibility, {
EligibilityState
 } from 'app/entities/eligibility/eligibility.reducer';
// prettier-ignore
import serviceArea, {
ServiceAreaState
 } from 'app/entities/service-area/service-area.reducer';
// prettier-ignore
import requiredDocument, {
RequiredDocumentState
 } from 'app/entities/required-document/required-document.reducer';
// prettier-ignore
import paymentAccepted, {
PaymentAcceptedState
} from 'app/entities/payment-accepted/payment-accepted.reducer';
// prettier-ignore
import language, {
LanguageState
 } from 'app/entities/language/language.reducer';
// prettier-ignore
import accessibilityForDisabilities, {
AccessibilityForDisabilitiesState
 } from 'app/entities/accessibility-for-disabilities/accessibility-for-disabilities.reducer';
// prettier-ignore
import serviceTaxonomy, {
ServiceTaxonomyState
 } from 'app/entities/service-taxonomy/service-taxonomy.reducer';
// prettier-ignore
import taxonomy, {
TaxonomyState
 } from 'app/entities/taxonomy/taxonomy.reducer';
// prettier-ignore
import organizationMatch, {
OrganizationMatchState
 } from 'app/entities/organization-match/organization-match.reducer';
// prettier-ignore
import metadata, {
MetadataState
} from 'app/entities/metadata/metadata.reducer';
// prettier-ignore
import openingHours, {
  OpeningHoursState
} from 'app/entities/opening-hours/opening-hours.reducer';
// prettier-ignore
import uploadPage, {
  UploadPageState
} from 'app/modules/upload/upload-page.reducer';
// prettier-ignore
import sharedRecordView, {
  SharedRecordViewState
} from 'app/modules/conflicts/shared/shared-record-view.reducer';
// prettier-ignore
import conflict, {
  ConflictState
} from 'app/entities/conflict/conflict.reducer';
// prettier-ignore
import dataImportReport, {
  DataImportReportState
} from 'app/entities/data-import-report/data-import-report.reducer';
// prettier-ignore
import activity, {
  ActivityState
} from 'app/shared/reducers/activity.reducer';
// prettier-ignore
import fieldExclusion, {
  FieldExclusionState
} from 'app/entities/field-exclusion/field-exclusion.reducer';
// prettier-ignore
import exclusionsConfig, {
  ExclusionsConfigState
} from 'app/entities/exclusions-config/exclusions-config.reducer';
// prettier-ignore
import geocodingResult, {
  GeocodingResultState
} from 'app/entities/geocoding-result/geocoding-result.reducer';
import filterActivity, { FilterActivityState } from 'app/modules/home/filter-activity.reducer';
// prettier-ignore
import filterShelter, { FilterShelterState } from 'app/modules/shelter/filter-shelter.reducer';
// prettier-ignore
import beds, {
  BedsState
} from 'app/entities/beds/beds.reducer';
// prettier-ignore
import shelter, {
  ShelterState
} from 'app/entities/shelter/shelter.reducer';
// prettier-ignore
import option, {
  OptionState
} from 'app/entities/option/option.reducer';
// prettier-ignore
import locationExclusion, {
  LocationExclusionState
} from 'app/entities/location-exclusion/location-exclusion.reducer';
// prettier-ignore
import organizationError, {
  OrganizationErrorState
} from 'app/entities/organization-error/organization-error.reducer';
import matchSimilarity, { MatchSimilarityState } from 'app/entities/match-similarity/match-similarity.reducer';
// prettier-ignore
import activityFilter, {
  ActivityFilterState
} from 'app/entities/activity-filter/activity-filter.reducer';
// prettier-ignore
import taxonomyGroup, {
  TaxonomyGroupState
} from 'app/entities/taxonomy-group/taxonomy-group.reducer';
// prettier-ignore
import fieldsDisplaySettings, {
  FieldsDisplaySettingsState
} from 'app/entities/fields-display-settings/fields-display-settings.reducer';
// prettier-ignore
import locationFieldsValue, {
  LocationFieldsValueState
} from 'app/entities/location-fields-value/location-fields-value.reducer';
// prettier-ignore
import organizationFieldsValue, {
  OrganizationFieldsValueState
} from 'app/entities/organization-fields-value/organization-fields-value.reducer';
// prettier-ignore
import physicalAddressFieldsValue, {
  PhysicalAddressFieldsValueState
} from 'app/entities/physical-address-fields-value/physical-address-fields-value.reducer';
// prettier-ignore
import postalAddressFieldsValue, {
  PostalAddressFieldsValueState
} from 'app/entities/postal-address-fields-value/postal-address-fields-value.reducer';
// prettier-ignore
import serviceFieldsValue, {
  ServiceFieldsValueState
} from 'app/entities/service-fields-value/service-fields-value.reducer';
// prettier-ignore
import serviceTaxonomiesDetailsFieldsValue, {
  ServiceTaxonomiesDetailsFieldsValueState
} from 'app/entities/service-taxonomies-details-fields-value/service-taxonomies-details-fields-value.reducer';
// prettier-ignore
import contactDetailsFieldsValue, {
  ContactDetailsFieldsValueState
} from 'app/entities/contact-details-fields-value/contact-details-fields-value.reducer';
// prettier-ignore
import feedback, { FeedbackState } from 'app/modules/feedback/feedback.reducer';
import requestLogger, { RequestLoggerState } from 'app/entities/request-logger/request-logger.reducer';
import clientManagement, { ClientManagementState } from 'app/modules/administration/client-management/client-management.reducer';
import dataStatus, { DataStatusState } from 'app/modules/data-status/data-status.reducer';
import providerRecord, { ProviderRecordsState } from 'app/modules/provider/provider-record.reducer';
import providerFilter, { ProviderFilterState } from 'app/modules/provider/provider-filter.reducer';
import deactivatedRecords, { DeactivatedRecordsState } from 'app/modules/provider/deactivated/deactivated-records.reducer';
import usersOrganizations, { UsersOrganizationsState } from 'app/modules/administration/users-organizations/users-organizations.reducer';

// prettier-ignore
import dailyUpdate, {
  DailyUpdateState
} from 'app/entities/daily-update/daily-update.reducer';

// prettier-ignore
import search, { SearchState } from 'app/modules/provider/menus/search.reducer';

// prettier-ignore
import silo, {
  SiloState
} from 'app/entities/silo/silo.reducer';
// prettier-ignore
import userGroup, {
  UserGroupState
} from 'app/entities/user-group/user-group.reducer';
// prettier-ignore
import beneficiary, {
  BeneficiaryState
} from 'app/entities/beneficiary/beneficiary.reducer';
// prettier-ignore
import referral, {
  ReferralState
} from 'app/entities/referral/referral.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly clientManagement: ClientManagementState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly scheduler: SchedulerState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly systemAccount: SystemAccountState;
  readonly documentUpload: DocumentUploadState;
  readonly organization: OrganizationState;
  readonly service: ServiceState;
  readonly program: ProgramState;
  readonly serviceAtLocation: ServiceAtLocationState;
  readonly location: LocationState;
  readonly physicalAddress: PhysicalAddressState;
  readonly postalAddress: PostalAddressState;
  readonly phone: PhoneState;
  readonly contact: ContactState;
  readonly regularSchedule: RegularScheduleState;
  readonly holidaySchedule: HolidayScheduleState;
  readonly funding: FundingState;
  readonly eligibility: EligibilityState;
  readonly serviceArea: ServiceAreaState;
  readonly requiredDocument: RequiredDocumentState;
  readonly paymentAccepted: PaymentAcceptedState;
  readonly language: LanguageState;
  readonly accessibilityForDisabilities: AccessibilityForDisabilitiesState;
  readonly serviceTaxonomy: ServiceTaxonomyState;
  readonly taxonomy: TaxonomyState;
  readonly organizationMatch: OrganizationMatchState;
  readonly metadata: MetadataState;
  readonly openingHours: OpeningHoursState;
  readonly uploadPage: UploadPageState;
  readonly sharedRecordView: SharedRecordViewState;
  readonly conflict: ConflictState;
  readonly dataImportReport: DataImportReportState;
  readonly activity: ActivityState;
  readonly filterActivity: FilterActivityState;
  readonly fieldExclusion: FieldExclusionState;
  readonly exclusionsConfig: ExclusionsConfigState;
  readonly geocodingResult: GeocodingResultState;
  readonly beds: BedsState;
  readonly shelter: ShelterState;
  readonly option: OptionState;
  readonly locationExclusion: LocationExclusionState;
  readonly organizationError: OrganizationErrorState;
  readonly matchSimilarity: MatchSimilarityState;
  readonly activityFilter: ActivityFilterState;
  readonly taxonomyGroup: TaxonomyGroupState;
  readonly fieldsDisplaySettings: FieldsDisplaySettingsState;
  readonly locationFieldsValue: LocationFieldsValueState;
  readonly organizationFieldsValue: OrganizationFieldsValueState;
  readonly physicalAddressFieldsValue: PhysicalAddressFieldsValueState;
  readonly postalAddressFieldsValue: PostalAddressFieldsValueState;
  readonly serviceFieldsValue: ServiceFieldsValueState;
  readonly serviceTaxonomiesDetailsFieldsValue: ServiceTaxonomiesDetailsFieldsValueState;
  readonly contactDetailsFieldsValue: ContactDetailsFieldsValueState;
  readonly dailyUpdate: DailyUpdateState;
  readonly silo: SiloState;
  readonly userGroup: UserGroupState;
  readonly beneficiary: BeneficiaryState;
  readonly referral: ReferralState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
  readonly filterShelter: FilterShelterState;
  readonly feedback: FeedbackState;
  readonly dataStatus: DataStatusState;
  readonly requestLogger: RequestLoggerState;
  readonly providerRecord: ProviderRecordsState;
  readonly providerFilter: ProviderFilterState;
  readonly search: SearchState;
  readonly deactivatedRecords: DeactivatedRecordsState;
  readonly usersOrganizations: UsersOrganizationsState;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  clientManagement,
  locale,
  applicationProfile,
  administration,
  scheduler,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  systemAccount,
  documentUpload,
  organization,
  service,
  program,
  serviceAtLocation,
  location,
  physicalAddress,
  postalAddress,
  phone,
  contact,
  regularSchedule,
  holidaySchedule,
  funding,
  eligibility,
  serviceArea,
  requiredDocument,
  paymentAccepted,
  language,
  accessibilityForDisabilities,
  serviceTaxonomy,
  taxonomy,
  organizationMatch,
  metadata,
  openingHours,
  uploadPage,
  sharedRecordView,
  conflict,
  dataImportReport,
  activity,
  fieldExclusion,
  exclusionsConfig,
  geocodingResult,
  beds,
  shelter,
  option,
  locationExclusion,
  organizationError,
  matchSimilarity,
  activityFilter,
  taxonomyGroup,
  fieldsDisplaySettings,
  locationFieldsValue,
  organizationFieldsValue,
  physicalAddressFieldsValue,
  postalAddressFieldsValue,
  serviceFieldsValue,
  serviceTaxonomiesDetailsFieldsValue,
  contactDetailsFieldsValue,
  dailyUpdate,
  silo,
  userGroup,
  beneficiary,
  referral,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
  filterActivity,
  filterShelter,
  feedback,
  requestLogger,
  dataStatus,
  providerRecord,
  providerFilter,
  search,
  deactivatedRecords,
  usersOrganizations
});

export default rootReducer;
