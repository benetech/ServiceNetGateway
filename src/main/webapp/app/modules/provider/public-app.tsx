import 'react-toastify/dist/ReactToastify.css';
import './provider-home.scss';
import '../../bootstrap.scss';

import React from 'react';
import { connect } from 'react-redux';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { Home as MainHome } from 'app/modules/home/home';
import { RouteComponentProps } from 'react-router-dom';
import { getUser } from 'app/modules/administration/user-management/user-management.reducer';
import { SideMenu } from './mobile-components/side-menu';
import Routes from './public-routes';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// tslint:disable-next-line:no-submodule-imports
import 'react-magic-slider-dots/dist/magic-dots.css';
import Header from 'app/shared/layout/header/header';

export interface IPublicAppProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
  siloName: string;
  urlBase: string;
}

export interface IPublicAppState {
  menuOpen: boolean;
}

export class PublicApp extends React.Component<IPublicAppProps, IPublicAppState> {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  render() {
    const { menuOpen } = this.state;
    const { match } = this.props;
    return (
      <div className="provider-public" id="provider-home-view-container">
        <SideMenu menuOpen={menuOpen} toggleMenu={this.toggleMenu} />
        <div className="app-container-public">
          <ToastContainer
            position={toast.POSITION.TOP_LEFT as ToastPosition}
            className="toastify-container"
            toastClassName="toastify-toast"
          />
          <ErrorBoundary>
            <Header
              isAuthenticated={this.props.isAuthenticated}
              isAdmin={this.props.isAdmin}
              currentLocale={this.props.currentLocale}
              onLocaleChange={this.props.setLocale}
              ribbonEnv={this.props.ribbonEnv}
              isStaging={this.props.isStaging}
              isInProduction={this.props.isInProduction}
              isSwaggerEnabled={this.props.isSwaggerEnabled}
              userLogin={this.props.userLogin}
              isSacramento={this.props.isSacramento}
              isShelterOwner={this.props.isShelterOwner}
            />
          </ErrorBoundary>
          <div>
            <div className="background-public">
              <Routes match={match} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, applicationProfile, locale, activity }: IRootState) => ({
  account: authentication.account,
  autosuggestOptions: MainHome.getAutosuggestOptions(activity.suggestions),
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  isSacramento: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.SACRAMENTO]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isStaging: applicationProfile.isStaging,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
  userLogin: authentication.account.login,
  isShelterOwner: authentication.account.shelters && authentication.account.shelters.length > 0,
  loggingOut: authentication.loggingOut
});

const mapDispatchToProps = {
  setLocale,
  getSession,
  getProfile,
  getUser
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicApp);
