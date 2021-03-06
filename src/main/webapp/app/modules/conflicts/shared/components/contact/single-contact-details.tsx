import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import '../../shared-record-view.scss';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IActivityRecord } from 'app/shared/model/activity-record.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AdditionalDetails } from '../additional-details';
import { IContact } from 'app/shared/model/contact.model';
import { getTextField } from 'app/shared/util/single-record-view-utils';
import _ from 'lodash';

export interface ISingleContactDetailsProp extends StateProps, DispatchProps {
  activity: IActivityRecord;
  contact: IContact;
  contactsCount: string;
  changeRecord: any;
  isOnlyOne: boolean;
  columnSize: number;
  showClipboard: boolean;
  isAreaOpen: boolean;
  settings?: any;
}

export interface ISingleContactDetailsState {
  isAreaOpen: boolean;
}

export class SingleContactDetails extends React.Component<ISingleContactDetailsProp, ISingleContactDetailsState> {
  state: ISingleContactDetailsState = {
    isAreaOpen: this.props.isAreaOpen
  };

  toggleAreaOpen = () => {
    this.setState({
      isAreaOpen: !this.state.isAreaOpen
    });
  };

  changeRecord = offset => () => {
    this.setState({ isAreaOpen: true });
    this.props.changeRecord(offset);
  };

  getFields = fieldsMap => {
    const { settings } = this.props;

    if (settings === undefined || (!!settings && !settings.id)) {
      return _.values(fieldsMap);
    }

    const { contactDetailsFields } = settings;

    const fieldsMapKeys = _.keys(fieldsMap);
    const keysFiltered = _.filter(fieldsMapKeys, k => contactDetailsFields.indexOf(k) > -1);
    return _.values(_.pick(fieldsMap, keysFiltered));
  };

  render() {
    const { contact, isOnlyOne, columnSize } = this.props;
    const customHeader = (
      <h4 className="title">
        <div className="collapseBtn" onClick={this.toggleAreaOpen}>
          <div className="collapseIcon">
            <FontAwesomeIcon size="xs" icon={this.state.isAreaOpen ? 'angle-up' : 'angle-down'} />
          </div>
          <Translate contentKey="singleRecordView.details.titleContacts" /> <span className="text-blue">{this.props.contactsCount}</span>
        </div>
        {isOnlyOne ? null : (
          <span>
            <span role="button" onClick={this.changeRecord(-1)}>
              <FontAwesomeIcon className="text-blue" icon="chevron-left" /> <Translate contentKey="singleRecordView.details.prev" />
            </span>
            <span role="button" onClick={this.changeRecord(1)}>
              <Translate contentKey="singleRecordView.details.next" /> <FontAwesomeIcon className="text-blue" icon="chevron-right" />
            </span>
          </span>
        )}
      </h4>
    );

    const fields = {
      NAME: getTextField(contact, 'name'),
      TITLE: getTextField(contact, 'title'),
      DEPARTMENT: getTextField(contact, 'department'),
      EMAIL: getTextField(contact, 'email')
    };
    return (
      <Row>
        <Col sm={columnSize}>
          <hr />
          <AdditionalDetails
            {...this.props}
            fields={this.getFields(fields)}
            entityClass={'Contact'}
            customHeader={customHeader}
            additionalFields={false}
            toggleAvailable
            isCustomToggle
            customToggleValue={this.state.isAreaOpen}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleContactDetails);
