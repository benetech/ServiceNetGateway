import _ from 'lodash';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { IUser } from 'app/shared/model/user.model';
import { IOrganization } from 'app/shared/model/organization.model';

export interface IOwnerInfoProps {
  owner: IUser;
  direction: string;
  organization?: IOrganization;
}

export interface IOwnerInfoState {
  tooltipId: string;
}

class OwnerInfo extends React.Component<IOwnerInfoProps, IOwnerInfoState> {
  tooltipContainerRef: any;
  constructor(props) {
    super(props);
    this.tooltipContainerRef = React.createRef();
    this.state = {
      tooltipId: _.uniqueId('activity-owner-span-')
    };
  }

  checkElement = id => {
    const { owner, direction } = this.props;
    if (_.get(this.tooltipContainerRef, 'current.id', null) === id) {
      return (
        <UncontrolledTooltip placement={direction} autohide={false} target={id}>
          {owner.email}
        </UncontrolledTooltip>
      );
    }
    return null;
  };

  render() {
    const { owner, organization } = this.props;
    const { tooltipId } = this.state;
    if (!_.isEmpty(owner)) {
      if (owner.firstName || owner.lastName) {
        return (
          <div className="d-inline-flex" id={tooltipId} ref={this.tooltipContainerRef}>
            {`${_.get(owner, 'firstName', '')} ${_.get(owner, 'lastName', '')}`}
            {this.checkElement(tooltipId)}
          </div>
        );
      } else {
        return <div className="d-inline-flex">{_.get(owner, 'email', '')}</div>;
      }
    } else if (organization) {
      return <div className="d-inline-flex">{_.get(organization, 'accountName', '')}</div>;
    }
    return null;
  }
}

export default OwnerInfo;
