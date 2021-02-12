import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import { reset } from 'app/entities/fields-display-settings/fields-display-settings.reducer';
import { reset as resetProviderFilters } from 'app/modules/provider/provider-filter.reducer';
import { resetText } from 'app/modules/provider/shared/search.reducer';
import { resetActivityFilter } from 'app/modules/home/filter-activity.reducer';

export interface ILogoutProps extends StateProps, DispatchProps {}

export class Logout extends React.Component<ILogoutProps> {
  componentDidMount() {
    this.props.reset();
    this.props.resetProviderFilters();
    this.props.resetActivityFilter();
    this.props.resetText();
    this.props.logout();
  }

  render() {
    return (
      <div className="p-5">
        <h4>Logged out successfully!</h4>
        <Redirect
          to={{
            pathname: '/',
            state: { loggingOut: true }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = { logout, reset, resetProviderFilters, resetText, resetActivityFilter };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);
