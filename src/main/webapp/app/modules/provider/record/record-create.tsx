import './record.scss';

import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Col, Row } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Prompt, RouteComponentProps } from 'react-router-dom';
import { createUserOwnedEntity } from 'app/entities/organization/organization.reducer';
import { IRootState } from 'app/shared/reducers';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { US_STATES } from 'app/shared/util/us-states';
import { getProviderTaxonomies } from 'app/entities/taxonomy/taxonomy.reducer';
import AvSelect from '@availity/reactstrap-validation-select';
// @ts-ignore
import BuildingLogo from '../../../../static/images/building.svg';
// @ts-ignore
import PeopleLogo from '../../../../static/images/people.svg';
// @ts-ignore
import ServiceLogo from '../../../../static/images/service.svg';
import _ from 'lodash';
import ButtonPill from '../shared/button-pill';

export interface IRecordCreateViewProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export interface IRecordCreateViewState {
  organization: object;
  activeTab: string;
  locationCount: number;
  locations: object[];
  services: object[];
  serviceCount: number;
  invalidTabs: string[];
  leaving: boolean;
}

const ORGANIZATION_TAB = 'organization';
const LOCATION_TAB = 'location';
const SERVICE_TAB = 'service';

const locationModel = {
  address1: '',
  address2: '',
  city: '',
  ca: 'CA',
  zipcode: ''
};
const initialLocations = [{ ...locationModel }];

const serviceModel = {
  name: '',
  taxonomyIds: [],
  description: '',
  applicationProcess: '',
  eligibilityCriteria: '',
  locationIndexes: []
};
const initialServices = [{ ...serviceModel }];

const organizationModel = {
  name: '',
  description: '',
  url: '',
  email: ''
};

export class RecordCreate extends React.Component<IRecordCreateViewProp, IRecordCreateViewState> {
  state: IRecordCreateViewState = {
    activeTab: ORGANIZATION_TAB,
    locationCount: 1,
    serviceCount: 1,
    organization: _.cloneDeep(organizationModel),
    locations: _.cloneDeep(initialLocations),
    services: _.cloneDeep(initialServices),
    invalidTabs: [],
    leaving: false
  };

  componentDidMount() {
    this.props.getProviderTaxonomies();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.setState(
        {
          leaving: true
        },
        () => this.props.history.push('/')
      );
    }
  }

  toggle(activeTab) {
    if (activeTab !== this.state.activeTab) {
      this.setState({
        activeTab
      });
    }
  }

  saveRecord = (event, errors, values) => {
    values.updatedAt = new Date();

    const invalidTabs = [];
    if (errors.length === 0) {
      const entity = {
        ...values
      };
      this.props.createUserOwnedEntity(entity);
    } else {
      if (errors.some(err => err.includes(LOCATION_TAB))) {
        invalidTabs.push(LOCATION_TAB);
      }
      if (errors.some(err => err.includes(SERVICE_TAB))) {
        invalidTabs.push(SERVICE_TAB);
      }
      if (errors.some(err => !err.includes(LOCATION_TAB) && !err.includes(SERVICE_TAB))) {
        invalidTabs.push(ORGANIZATION_TAB);
      }
    }
    this.setState({ invalidTabs });
  };

  addAnotherService = () => {
    const services = this.state.services.concat({ ...serviceModel });
    this.setState({
      serviceCount: this.state.serviceCount + 1,
      services
    });
  };

  addAnotherLocation = () => {
    const locations = this.state.locations.concat({ ...locationModel });
    this.setState({
      locationCount: this.state.locationCount + 1,
      locations
    });
  };

  removeService = () => {
    const { serviceCount, services } = this.state;
    if (serviceCount > 1) {
      services.pop();
      this.setState({
        serviceCount: serviceCount - 1,
        services
      });
    }
  };

  removeLocation = () => {
    const { locationCount, locations, services } = this.state;
    if (locationCount > 1) {
      locations.pop();
      // filter out this location from services
      services.forEach(service => (service['locationIndexes'] = service['locationIndexes'].filter(value => value !== locations.length)));
      this.setState({
        locationCount: locationCount - 1,
        locations,
        services
      });
    }
  };

  getLocations = () =>
    Array.apply(null, { length: this.state.locationCount }).map((e, i) => {
      const location = this.state.locations[i];
      return {
        value: i,
        label: i + 1 + '. ' + [location['address1'], location['address2'], location['city']].filter(item => item).join(', ')
      };
    });

  onOrganizationChange = fieldName => ({ target }) => {
    const organization = this.state.organization;
    organization[fieldName] = target.value;
    this.setState({
      organization
    });
  };

  onLocationChange = (i, fieldName) => ({ target }) => {
    const locations = this.state.locations;
    locations[i][fieldName] = target.value;
    this.setState({
      locations
    });
  };

  onServiceChange = (i, fieldName, defaultValue = null) => event => {
    const services = this.state.services;
    let value = event != null && event.target ? event.target.value : event;
    if (value === null) {
      value = defaultValue;
    }
    services[i][fieldName] = value;
    this.setState({
      services
    });
  };

  render() {
    const { organization, locations, services, activeTab, invalidTabs, locationCount, serviceCount, leaving } = this.state;
    const { updating, taxonomyOptions } = this.props;
    return (
      <div className="record-create">
        <Nav tabs>
          <NavItem className={`${invalidTabs.includes(ORGANIZATION_TAB) ? 'invalid' : ''}`}>
            <NavLink className={`${activeTab === ORGANIZATION_TAB ? 'active' : ''}`} onClick={() => this.toggle(ORGANIZATION_TAB)}>
              1. <Translate contentKey="record.tabs.organization" />
            </NavLink>
          </NavItem>
          <NavItem className={`${invalidTabs.includes(LOCATION_TAB) ? 'invalid' : ''}`}>
            <NavLink className={`${activeTab === LOCATION_TAB ? 'active' : ''}`} onClick={() => this.toggle(LOCATION_TAB)}>
              2. <Translate contentKey="record.tabs.locations" />
            </NavLink>
          </NavItem>
          <NavItem className={`${invalidTabs.includes(SERVICE_TAB) ? 'invalid' : ''}`}>
            <NavLink className={`${activeTab === SERVICE_TAB ? 'active' : ''}`} onClick={() => this.toggle(SERVICE_TAB)}>
              3. <Translate contentKey="record.tabs.services" />
            </NavLink>
          </NavItem>
        </Nav>

        <AvForm model={{}} onSubmit={this.saveRecord} className="background">
          <Prompt
            when={
              !leaving &&
              (!_.isEqual(organization, organizationModel) ||
                !_.isEqual(locations, initialLocations) ||
                !_.isEqual(services, initialServices))
            }
            message={location => `You have unsaved data, are you sure you want to leave?`}
          />
          <TabContent activeTab={activeTab}>
            <TabPane tabId={ORGANIZATION_TAB}>
              <Col md={{ size: 10, offset: 1 }}>
                <div className="heading">
                  <img src={PeopleLogo} height={100} alt="Organization" />
                  <h2>
                    <Translate contentKey="record.heading.organization" />
                  </h2>
                  <div className="description">
                    <Translate contentKey="record.heading.organizationDescription" />
                  </div>
                </div>
                <AvGroup className="flex">
                  <div className="required" />
                  <AvField
                    id="organization-name"
                    type="text"
                    name="name"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                    placeholder={translate('record.name')}
                    onChange={this.onOrganizationChange('name')}
                  />
                </AvGroup>
                <AvGroup>
                  <AvInput
                    id="organization-description"
                    type="textarea"
                    name="description"
                    placeholder={translate('record.description')}
                    onChange={this.onOrganizationChange('description')}
                  />
                </AvGroup>
                <AvGroup>
                  <AvField
                    id="organization-url"
                    type="text"
                    name="url"
                    placeholder={translate('record.url')}
                    onChange={this.onOrganizationChange('url')}
                  />
                </AvGroup>
                <AvGroup>
                  <AvField
                    id="organization-email"
                    type="text"
                    name="email"
                    validate={{
                      maxLength: { value: 50, errorMessage: translate('entity.validation.maxlength', { max: 50 }) }
                    }}
                    placeholder={translate('record.email')}
                    onChange={this.onOrganizationChange('email')}
                  />
                </AvGroup>
              </Col>
              <div className="buttons navigation-buttons">
                <ButtonPill onClick={() => this.props.history.goBack()} className="button-pill-secondary">
                  <FontAwesomeIcon icon="angle-left" />
                  &nbsp;
                  <Translate contentKey="record.navigation.goBack" />
                </ButtonPill>
                <ButtonPill onClick={() => this.toggle(LOCATION_TAB)} className="pull-right button-pill-secondary">
                  <Translate contentKey="record.navigation.addLocations" />
                  &nbsp;
                  <FontAwesomeIcon icon="angle-right" />
                </ButtonPill>
              </div>
            </TabPane>
            <TabPane tabId={LOCATION_TAB}>
              <Col md={{ size: 10, offset: 1 }}>
                <div className="heading">
                  <img src={BuildingLogo} height={100} alt="Location" />
                  <h2>
                    <Translate contentKey="record.heading.locations" />
                  </h2>
                  <div className="description">
                    <Translate contentKey="record.heading.locationsDescription" />
                  </div>
                </div>
                {Array.apply(null, { length: locationCount }).map((e, i) => (
                  <Row className="item location">
                    <Col md={1}>
                      <h4>{i + 1}.</h4>
                    </Col>
                    <Col md={11}>
                      <AvGroup className="flex">
                        <div className="required" />
                        <AvInput
                          type="textarea"
                          name={'locations[' + i + '].address1'}
                          onChange={this.onLocationChange(i, 'address1')}
                          placeholder={translate('record.location.address1')}
                          validate={{
                            required: { value: true, errorMessage: translate('entity.validation.required') }
                          }}
                        />
                      </AvGroup>
                      <AvGroup>
                        <AvInput
                          type="textarea"
                          name={'locations[' + i + '].address2'}
                          onChange={this.onLocationChange(i, 'address2')}
                          placeholder={translate('record.location.address2')}
                        />
                      </AvGroup>
                      <Row>
                        <Col md={7} className="flex mb-3">
                          <div className="required" />
                          <AvInput
                            type="text"
                            name={'locations[' + i + '].city'}
                            onChange={this.onLocationChange(i, 'city')}
                            placeholder={translate('record.location.city')}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                          />
                        </Col>
                        <Col md={2} className="flex mb-3">
                          <div className="required" />
                          <AvField
                            type="select"
                            name={'locations[' + i + '].ca'}
                            onChange={this.onLocationChange(i, 'ca')}
                            placeholder={translate('record.location.ca')}
                            value={locationModel['ca']}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                            style={{ minWidth: '5em' }}
                          >
                            {US_STATES.map(state => (
                              <option value={state} key={state}>
                                {state}
                              </option>
                            ))}
                          </AvField>
                        </Col>
                        <Col md={3} className="flex mb-3">
                          <div className="required" />
                          <AvInput
                            type="text"
                            name={'locations[' + i + '].zipcode'}
                            onChange={this.onLocationChange(i, 'zipcode')}
                            placeholder={translate('record.location.zipcode')}
                            validate={{
                              required: { value: true, errorMessage: translate('entity.validation.required') }
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ))}
              </Col>
              <div className="buttons list-buttons">
                {this.state.locationCount === 1 ? null : (
                  <ButtonPill onClick={this.removeLocation} className="button-pill-secondary mr-1">
                    <Translate contentKey="record.remove" />
                  </ButtonPill>
                )}
                <ButtonPill onClick={this.addAnotherLocation} className="button-pill-secondary">
                  <FontAwesomeIcon icon="plus" />
                  &nbsp;
                  <Translate contentKey="record.addAnother" />
                </ButtonPill>
              </div>
              <div className="buttons navigation-buttons">
                <ButtonPill onClick={() => this.toggle(ORGANIZATION_TAB)} className="button-pill-secondary">
                  <FontAwesomeIcon icon="angle-left" />
                  &nbsp;
                  <Translate contentKey="record.navigation.goBack" />
                </ButtonPill>
                <ButtonPill onClick={() => this.toggle(SERVICE_TAB)} className="pull-right button-pill-secondary">
                  <Translate contentKey="record.navigation.addServices" />
                  &nbsp;
                  <FontAwesomeIcon icon="angle-right" />
                </ButtonPill>
              </div>
            </TabPane>
            <TabPane tabId={SERVICE_TAB}>
              <Col md={{ size: 10, offset: 1 }}>
                <div className="heading">
                  <img src={ServiceLogo} height={100} alt="Service" />
                  <h2>
                    <Translate contentKey="record.heading.services" />
                  </h2>
                  <div className="description">
                    <Translate contentKey="record.heading.servicesDescription" />
                  </div>
                </div>
                {Array.apply(null, { length: serviceCount }).map((e, i) => (
                  <Row className="item service">
                    <Col md={1}>
                      <h4>{i + 1}.</h4>
                    </Col>
                    <Col md={11}>
                      <AvGroup className="flex">
                        <div className="required" />
                        <AvInput
                          type="text"
                          name={'services[' + i + '].name'}
                          placeholder={translate('record.service.name')}
                          validate={{
                            required: { value: true, errorMessage: translate('entity.validation.required') }
                          }}
                          onChange={this.onServiceChange(i, 'name')}
                        />
                      </AvGroup>
                      <AvGroup className="flex">
                        <div className="required" />
                        <AvSelect
                          name={'services[' + i + '].taxonomyIds'}
                          validate={{
                            required: { value: true, errorMessage: translate('entity.validation.required') }
                          }}
                          options={taxonomyOptions}
                          // @ts-ignore
                          isMulti
                          placeholder={translate('record.service.type')}
                          onChange={this.onServiceChange(i, 'taxonomyIds')}
                        />
                      </AvGroup>
                      <AvGroup className="flex">
                        <div className="required" />
                        <AvInput
                          type="textarea"
                          name={'services[' + i + '].description'}
                          placeholder={translate('record.service.description')}
                          validate={{
                            required: { value: true, errorMessage: translate('entity.validation.required') }
                          }}
                          onChange={this.onServiceChange(i, 'description')}
                        />
                      </AvGroup>
                      <AvGroup>
                        <AvInput
                          type="textarea"
                          name={'services[' + i + '].applicationProcess'}
                          placeholder={translate('record.service.applicationProcess')}
                          onChange={this.onServiceChange(i, 'applicationProcess')}
                        />
                      </AvGroup>
                      <AvGroup>
                        <AvInput
                          type="textarea"
                          name={'services[' + i + '].eligibilityCriteria'}
                          placeholder={translate('record.service.eligibilityCriteria')}
                          onChange={this.onServiceChange(i, 'eligibilityCriteria')}
                        />
                      </AvGroup>
                      <AvGroup>
                        <AvSelect
                          name={'services[' + i + '].locationIndexes'}
                          value={this.state.services[i]['locationIndexes']}
                          onChange={this.onServiceChange(i, 'locationIndexes', [])}
                          options={this.getLocations()}
                          // @ts-ignore
                          isMulti
                          placeholder={translate('record.service.locations')}
                        />
                      </AvGroup>
                    </Col>
                  </Row>
                ))}
              </Col>
              <div className="buttons list-buttons">
                {this.state.serviceCount === 1 ? null : (
                  <ButtonPill onClick={this.removeService} className="button-pill-secondary mr-1">
                    <Translate contentKey="record.remove" />
                  </ButtonPill>
                )}
                <ButtonPill onClick={this.addAnotherService} className="button-pill-secondary">
                  <FontAwesomeIcon icon="plus" />
                  &nbsp;
                  <Translate contentKey="record.addAnother" />
                </ButtonPill>
              </div>
              <div className="buttons navigation-buttons">
                <ButtonPill onClick={() => this.toggle(LOCATION_TAB)} className="button-pill-secondary">
                  <FontAwesomeIcon icon="angle-left" />
                  &nbsp;
                  <Translate contentKey="record.navigation.goBack" />
                </ButtonPill>
                <ButtonPill className={`pull-right button-pill-primary outline-none ${updating ? 'disabled' : ''}`}>
                  <button id="submit" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    <Translate contentKey="record.navigation.submit" />
                  </button>
                </ButtonPill>
              </div>
            </TabPane>
          </TabContent>
        </AvForm>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  locations: storeState.location.entities,
  updating: storeState.organization.updating,
  updateSuccess: storeState.organization.updateSuccess,
  taxonomyOptions: storeState.taxonomy.providerTaxonomies.map(taxonomy => ({ value: taxonomy.id, label: taxonomy.name }))
});

const mapDispatchToProps = {
  getProviderTaxonomies,
  createUserOwnedEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordCreate);
