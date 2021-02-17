import { Avatar } from 'app/shared/layout/header/avatar';
import { Translate, translate } from 'react-jhipster';
import UserRecords from 'app/modules/provider/user-records';
import React from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getSession } from 'app/shared/reducers/authentication';
import AllRecords from './all-records';
import { cleanReferredRecords } from './provider-record.reducer';
import SingleRecordView from 'app/modules/provider/record/single-record-view';
import { toggleSingleRecordView } from 'app/modules/provider/provider-record.reducer';

export interface IHomeProps extends StateProps, DispatchProps {}

export interface IHomeState {
  isMapView: boolean;
}

export class Home extends React.Component<IHomeProps, IHomeState> {
  state = {
    isMapView: false
  };
  componentDidMount() {
    const { previousUserName, userName } = this.props;
    const hasUserChanged = previousUserName !== userName;
    this.props.toggleSingleRecordView({ orgId: null, singleRecordViewActive: false });
    if (hasUserChanged) {
      this.props.cleanReferredRecords();
    }
    this.props.getSession();
  }

  toggleMapView = () =>
    this.setState({
      isMapView: !this.state.isMapView
    });

  header = (userLogin: string, avatarBase64: string) => (
    <div>
      <div className="hero-image">
        <div className="hero-text py-2">
          <div className="hero-avatar">
            <Avatar size="big" name={`${userLogin && userLogin.charAt(0).toUpperCase()} `} avatarBase64={avatarBase64} />
          </div>
          <h5 className="hello-text">
            <b>{`${translate('providerSite.hello')}${userLogin}!`}</b>
          </h5>
          <h4 className="hello-text">
            <Translate contentKey="providerSite.anyUpdates" />
          </h4>
        </div>
      </div>
    </div>
  );

  render() {
    const { userLogin, avatarBase64, recordToOpen, singleRecordViewActive } = this.props;
    const { isMapView } = this.state;
    return (
      <div>
        {singleRecordViewActive ? <SingleRecordView orgId={recordToOpen} withBackButton /> : null}
        <div id="home-container" className={`${singleRecordViewActive ? 'd-none' : ''} overflowYAuto`}>
          <div className={`background`}>
            {!isMapView && this.header(userLogin, avatarBase64)}
            {!isMapView && (
              <div className="user-cards-container">
                <UserRecords />
              </div>
            )}
            <div className={`all-records-container${isMapView ? ' map' : ''}`}>
              <AllRecords toggleMapView={this.toggleMapView} isMapView={isMapView} referring />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, providerRecord }: IRootState) => ({
  userLogin: authentication.account.login,
  userName: authentication.account.login,
  previousUserName: providerRecord.userName,
  avatarBase64: authentication.account.avatarBase64,
  recordToOpen: providerRecord.orgId,
  singleRecordViewActive: providerRecord.singleRecordViewActive
});

const mapDispatchToProps = {
  getSession,
  cleanReferredRecords,
  toggleSingleRecordView
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
