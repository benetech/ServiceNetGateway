import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { IRootState } from 'app/shared/reducers';
import { getSession, login } from 'app/shared/reducers/authentication';
import LoginModal from './login-modal';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { resetActivityFilter } from 'app/modules/home/filter-activity.reducer';
import { resetText } from 'app/modules/provider/shared/search.reducer';

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export interface ILoginState {
  showModal: boolean;
}

export class Login extends React.Component<ILoginProps, ILoginState> {
  state: ILoginState = {
    showModal: this.props.showModal
  };

  componentDidUpdate(prevProps: ILoginProps, prevState) {
    if (this.props !== prevProps) {
      if (this.props.loginSuccess && !prevProps.loginSuccess) {
        this.props.getSession();
      }
      this.setState({ showModal: this.props.showModal });
    }
  }

  handleLogin = (username, password, captcha, rememberMe = false) => {
    this.props.resetActivityFilter();
    this.props.resetText();
    this.props.login(username, password, captcha, rememberMe);
  };

  handleClose = () => {
    this.setState({
      showModal: false
    });
    this.props.history.push(location.hash.replace('/login', '').replace('#', ''));
  };

  render() {
    const { location, isAuthenticated, account } = this.props;
    const defaultRoute = hasAnyAuthority(account.authorities, [AUTHORITIES.SACRAMENTO])
      ? { pathname: '/shelters' }
      : { pathname: '/', search: location.search };
    const { from } = location.state || { from: defaultRoute };
    const { showModal } = this.state;
    if (isAuthenticated) {
      return <Redirect to={from} />;
    }
    return (
      <LoginModal showModal={showModal} handleLogin={this.handleLogin} handleClose={this.handleClose} loginError={this.props.loginError} />
    );
  }
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  account: authentication.account,
  loginError: authentication.loginError,
  loginSuccess: authentication.loginSuccess,
  showModal: authentication.showModalLogin
});

const mapDispatchToProps = { login, getSession, resetActivityFilter, resetText };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
