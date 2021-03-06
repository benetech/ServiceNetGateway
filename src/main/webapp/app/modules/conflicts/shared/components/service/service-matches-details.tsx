import React from 'react';
import '../../shared-record-view.scss';
import { connect } from 'react-redux';
import { Collapse } from 'reactstrap';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { getPartnerRecord, setOpenedPartnerService } from '../../shared-record-view.reducer';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';

export interface IServiceMatch {
  id: string;
  organizationName: string;
  serviceName: string;
  serviceId: string;
  matchingServiceId: string;
  orgId: string;
}

export interface IServiceMatchesDetailsProp extends StateProps, DispatchProps {
  serviceMatches: IServiceMatch;
  serviceId: any;
  orgId?: string;
  isBaseRecord?: boolean;
}

export interface IServiceMatchesDetailsState {
  isAreaOpen: boolean;
}

export class ServiceMatchesDetails extends React.Component<IServiceMatchesDetailsProp, IServiceMatchesDetailsState> {
  state: IServiceMatchesDetailsState = {
    isAreaOpen: true
  };

  toggleAreaOpen = () => {
    this.setState({
      isAreaOpen: !this.state.isAreaOpen
    });
  };

  handleMatchClick = service => () => {
    this.props.getPartnerRecord(service.orgId);
    this.props.setOpenedPartnerService(service.matchingService);
  };

  render() {
    const { serviceMatches, serviceId, isBaseRecord, orgId } = this.props;
    return isBaseRecord ? (
      <div>
        <h4 className="title">
          <div className={'collapseBtn'} onClick={this.toggleAreaOpen}>
            <div className="collapseIcon">
              <FontAwesomeIcon size="xs" icon={this.state.isAreaOpen ? 'angle-up' : 'angle-down'} />
            </div>
            <Translate contentKey={'serviceNetApp.service.matches'} />
          </div>
        </h4>
        <Collapse isOpen={this.state.isAreaOpen}>
          {serviceMatches &&
            _.map(serviceMatches[serviceId], (field, i) => (
              <div key={i}>
                <Link onClick={this.handleMatchClick(field)} to={`/multi-record-view/${orgId}/${field.orgId}`}>
                  {`${field.organizationName} - ${field.serviceName}`}
                </Link>
              </div>
            ))}
        </Collapse>
      </div>
    ) : (
      ''
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = { getPartnerRecord, setOpenedPartnerService };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceMatchesDetails);
