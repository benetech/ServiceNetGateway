import React from 'react';
import { Col, Row, Button, Label } from 'reactstrap';
import '../../shared-record-view.scss';
import { TextFormat, translate, Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IActivityRecord } from 'app/shared/model/activity-record.model';
import { OpeningHoursDetails } from '../opening-hours-details';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AdditionalDetails } from '../additional-details';
import { IServiceRecord } from 'app/shared/model/service-record.model';
import { EligibilityDetails } from './eligibility-details';
import { FundingDetails } from './funding-details';
import { RequiredDocumentsDetails } from './required-documents-details';
import { ServiceTaxonomiesDetails } from './service-taxonomies-details';
import { PaymentsAcceptedDetails } from './payments-accepted-details';
import { LanguagesDetails } from '../languages-details';
import { HolidaySchedulesDetails } from '../holiday-schedules-details';
import { ContactsDetails } from '../contact/contacts-details';
import { PhonesDetails } from '../phone/phones-details';
import ServiceMatchesDetails from './service-matches-details';
import { getTextField } from 'app/shared/util/single-record-view-utils';
import { APP_DATE_FORMAT } from 'app/config/constants';
import Select from 'react-select';
import _ from 'lodash';
import { createServiceMatch, deleteServiceMatch, setOpenedPartnerService } from 'app/modules/conflicts/shared/shared-record-view.reducer';

export interface ISingleServiceDetailsProp extends StateProps, DispatchProps {
  activity: IActivityRecord;
  record: IServiceRecord;
  servicesCount: string;
  changeRecord: any;
  isOnlyOne: boolean;
  columnSize: number;
  showClipboard: boolean;
  isAreaOpen: boolean;
  selectOptions: any;
  settings?: any;
  serviceMatches?: any;
  isBaseRecord: boolean;
  selectedOption: number;
  baseRecord?: any;
  orgId?: string;
}

export interface ISingleServiceDetailsState {
  isAreaOpen: boolean;
}

export class SingleServiceDetails extends React.Component<ISingleServiceDetailsProp, ISingleServiceDetailsState> {
  myRef: any;
  state: ISingleServiceDetailsState = {
    isAreaOpen: this.props.isAreaOpen
  };

  constructor(props) {
    super(props);
    if (!props.isBaseRecord) {
      this.myRef = React.createRef();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.openedPartnerService !== null &&
      this.props.openedPartnerService === null &&
      this.props.record.service.id === prevProps.openedPartnerService
    ) {
      this.setState({ isAreaOpen: true }, () => {
        this.myRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start'
        });
        window.scrollBy(0, -100);
      });
    }
    if (this.props.record.service.id === this.props.openedPartnerService && !this.props.isBaseRecord) {
      this.props.setOpenedPartnerService(null);
    }
  }

  toggleAreaOpen = () => {
    this.setState({
      isAreaOpen: !this.state.isAreaOpen
    });
  };

  changeRecord = record => {
    this.setState({ isAreaOpen: true });
    this.props.changeRecord(record.value);
  };

  getFields = fieldsMap => {
    const { settings } = this.props;

    if (settings === undefined || (!!settings && !settings.id)) {
      return _.values(fieldsMap);
    }

    const { serviceFields } = settings;

    const fieldsMapKeys = _.keys(fieldsMap);
    const keysFiltered = _.filter(fieldsMapKeys, k => serviceFields.indexOf(k) > -1);
    return _.values(_.pick(fieldsMap, keysFiltered));
  };

  matchService = () => {
    const matchingServiceId = this.props.record.service.id;
    const serviceId = this.props.baseService;
    const orgId = this.props.baseRecord.organization.id;
    this.props.createServiceMatch(serviceId, matchingServiceId, orgId);
  };

  unmatchService = () => {
    const matchingServiceId = this.props.record.service.id;
    const serviceId = this.props.baseService;
    const orgId = this.props.baseRecord.organization.id;
    this.props.deleteServiceMatch(serviceId, matchingServiceId, orgId);
  };

  isMatched = () => {
    const { serviceMatches, baseService } = this.props;
    const matchingServiceId = this.props.record.service.id;
    if (!!serviceMatches) {
      return _.some(
        _.reduce(serviceMatches, (total, current) => total.concat(current), []),
        val => val.matchingService === matchingServiceId && val.service === baseService
      );
    }
    return true;
  };

  render() {
    const {
      record,
      isOnlyOne,
      columnSize,
      selectOptions,
      servicesCount,
      settings,
      serviceMatches,
      isBaseRecord,
      selectedOption,
      orgId
    } = this.props;

    const customHeader = (
      <div ref={this.myRef} className="title d-flex justify-content-start align-items-center mb-1">
        <div
          className="col collapseBtn d-flex justify-content-start align-items-center pr-3 h4 mb-0 pl-0 flex-grow-0"
          onClick={this.toggleAreaOpen}
        >
          <div className="collapseIcon">
            <FontAwesomeIcon size="xs" icon={this.state.isAreaOpen ? 'angle-up' : 'angle-down'} />
          </div>
          <Translate contentKey="singleRecordView.details.titleServices" /> <span className="text-blue ml-1">{servicesCount}</span>
        </div>
        {isOnlyOne ? null : (
          <div className="flex-grow-1">
            <Label className="sr-only" for="services">
              {translate('serviceNetApp.activity.home.services')}
            </Label>
            <Select onChange={this.changeRecord} options={selectOptions} value={selectOptions[selectedOption]} inputId="services" />
          </div>
        )}
      </div>
    );

    const matchButton = (
      <Button onClick={this.matchService} color="info">
        <FontAwesomeIcon icon="arrow-left" />{' '}
        <span className="d-none d-md-inline">
          <Translate contentKey="multiRecordView.matchesMyServiceRecord" />
        </span>
      </Button>
    );

    const unmatchButton = (
      <Button onClick={this.unmatchService} color="danger">
        <FontAwesomeIcon icon="arrow-left" />{' '}
        <span className="d-none d-md-inline">
          <Translate contentKey="multiRecordView.unmatchThisRecord" />
        </span>
      </Button>
    );

    const toggleMatch = (
      <h5>
        {serviceMatches && this.props.baseRecord && this.props.baseRecord.organization.id !== record.service.organizationId
          ? this.isMatched()
            ? unmatchButton
            : matchButton
          : ''}
      </h5>
    );

    const itemHeader = (
      <div>
        {toggleMatch}
        <h5>
          <Translate contentKey="multiRecordView.lastCompleteReview" />
          {record.service.lastVerifiedOn ? (
            <TextFormat value={record.service.lastVerifiedOn} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
          ) : (
            <Translate contentKey="multiRecordView.unknown" />
          )}
        </h5>
        <h5>
          <Translate contentKey="multiRecordView.lastUpdated" />
          {record.service.updatedAt ? (
            <TextFormat value={record.service.updatedAt} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
          ) : (
            <Translate contentKey="multiRecordView.unknown" />
          )}
        </h5>
      </div>
    );

    const additionalFields = {
      TAXONOMIES: (
        <ServiceTaxonomiesDetails key="service-taxonomies-details" {...this.props} taxonomies={record.taxonomies} settings={settings} />
      ),
      ELIGIBILITY: <EligibilityDetails key="eligibility-details" {...this.props} eligibility={record.eligibility} />,
      FUNDING: <FundingDetails key="funding-details" {...this.props} funding={record.funding} />,
      DOCS: <RequiredDocumentsDetails key="required-documents-details" {...this.props} docs={record.docs} />,
      PAYMENTS_ACCEPTEDS: <PaymentsAcceptedDetails key="payments-accepted-details" {...this.props} payments={record.paymentsAccepteds} />,
      REGULAR_SCHEDULE_OPENING_HOURS: (
        <OpeningHoursDetails key="opening-hours-details" {...this.props} hours={record.regularScheduleOpeningHours} />
      ),
      LANGS: <LanguagesDetails key="languages-details" {...this.props} langs={record.langs} />,
      HOLIDAY_SCHEDULES: <HolidaySchedulesDetails key="holiday-schedules-details" {...this.props} schedules={record.holidaySchedules} />,
      CONTACTS: <ContactsDetails key="contacts-details" {...this.props} contacts={record.contacts} settings={settings} />,
      PHONES: <PhonesDetails key="phones-details" {...this.props} phones={record.phones} />,
      SERVICE_MATCHES: (
        <ServiceMatchesDetails
          key="service-matches"
          orgId={orgId}
          serviceMatches={serviceMatches}
          serviceId={record.service.id}
          isBaseRecord={isBaseRecord}
        />
      )
    };

    const fields = {
      NAME: getTextField(record.service, 'name'),
      ALTERNATE_NAME: getTextField(record.service, 'alternateName'),
      DESCRIPTION: {
        type: 'textarea',
        fieldName: 'description',
        defaultValue: record.service.description
      },
      URL: getTextField(record.service, 'url'),
      EMAIL: getTextField(record.service, 'email'),
      STATUS: getTextField(record.service, 'status'),
      INTERPRETATION_SERVICES: {
        type: 'textarea',
        fieldName: 'interpretationServices',
        defaultValue: record.service.interpretationServices
      },
      APPLICATION_PROCESS: {
        type: 'textarea',
        fieldName: 'applicationProcess',
        defaultValue: record.service.applicationProcess
      },
      WAIT_TIME: {
        type: 'textarea',
        fieldName: 'waitTime',
        defaultValue: record.service.waitTime
      },
      FEES: {
        type: 'textarea',
        fieldName: 'fees',
        defaultValue: record.service.fees
      },
      ACCREDITATIONS: {
        type: 'textarea',
        fieldName: 'accreditations',
        defaultValue: record.service.accreditations
      },
      LICENSES: {
        type: 'textarea',
        fieldName: 'licenses',
        defaultValue: record.service.licenses
      },
      TYPE: getTextField(record, 'type')
    };
    return (
      <Row>
        <Col sm={columnSize}>
          <hr />
          <AdditionalDetails
            {...this.props}
            fields={this.getFields(fields)}
            entityClass={'Service'}
            customHeader={customHeader}
            additionalFields={this.getFields(additionalFields)}
            itemHeader={itemHeader}
            toggleAvailable
            isCustomToggle
            customToggleValue={this.state.isAreaOpen}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  baseService: state.sharedRecordView.openedService,
  openedPartnerService: state.sharedRecordView.openedPartnerService
});

const mapDispatchToProps = { createServiceMatch, deleteServiceMatch, setOpenedPartnerService };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleServiceDetails);
