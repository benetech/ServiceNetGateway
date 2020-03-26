import 'filepond/dist/filepond.min.css';
import './single-record-view.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import Tabs from './tabs';
import { getBaseRecord, getMatches } from '../shared/shared-record-view.reducer';
import { RouteComponentProps } from 'react-router-dom';
import { TextFormat, Translate } from 'react-jhipster';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { getUser } from 'app/modules/administration/user-management/user-management.reducer';

export interface ISingleRecordViewProp extends StateProps, DispatchProps, RouteComponentProps<{}> {
  showClipboard: boolean;
}

export interface ISingleRecordViewState {
  match: any;
}

export class SingleRecordView extends React.Component<ISingleRecordViewProp, ISingleRecordViewState> {
  state: ISingleRecordViewState = {
    match: null
  };

  componentDidMount() {
    this.props.getBaseRecord(this.props.orgId);
    this.props.getMatches(this.props.orgId);
    this.props.getUser(this.props.account.login);
  }

  render() {
    const { activityRecord, user } = this.props;
    const content = activityRecord ? (
      <Row>
        <Col>
          <h2>{activityRecord.organization.name}</h2>
          <h5>
            {activityRecord.organization.accountId === user.systemAccountId ? (
              <Translate contentKey="multiRecordView.yourData" />
            ) : (
              <span>
                <Translate contentKey="singleRecordView.partnerName" /> {activityRecord.organization.accountName}
              </span>
            )}
          </h5>
          <h5>
            <Translate contentKey="multiRecordView.lastCompleteReview" />
            {activityRecord.organization.lastVerifiedOn ? (
              <TextFormat value={activityRecord.organization.lastVerifiedOn} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
            ) : (
              <Translate contentKey="multiRecordView.unknown" />
            )}
          </h5>
          <h5>
            <Translate contentKey="multiRecordView.lastUpdated" />
            {activityRecord.lastUpdated ? (
              <TextFormat value={activityRecord.lastUpdated} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
            ) : (
              <Translate contentKey="multiRecordView.unknown" />
            )}
          </h5>
          <Tabs activity={activityRecord} {...this.props} />
        </Col>
      </Row>
    ) : (
      <Row>
        <Col>
          <h2>Loading...</h2>
        </Col>
      </Row>
    );

    return content;
  }
}

const mapStateToProps = (storeState, { match }: ISingleRecordViewState) => ({
  orgId: match.params.orgId,
  activityRecord: storeState.sharedRecordView.baseRecord,
  organizationMatches: storeState.sharedRecordView.matches,
  dismissedMatches: storeState.sharedRecordView.dismissedMatches,
  account: storeState.authentication.account,
  user: storeState.userManagement.user
});

const mapDispatchToProps = { getBaseRecord, getMatches, getUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleRecordView);
