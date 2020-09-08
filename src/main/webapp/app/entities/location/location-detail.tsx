import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './location.reducer';
import { ILocation } from 'app/shared/model/location.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ILocationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class LocationDetail extends React.Component<ILocationDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { locationEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="serviceNetApp.location.detail.title">Location</Translate> [<b>{locationEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="serviceNetApp.location.name">Name</Translate>
              </span>
            </dt>
            <dd>{locationEntity.name}</dd>
            <dt>
              <span id="alternateName">
                <Translate contentKey="serviceNetApp.location.alternateName">Alternate Name</Translate>
              </span>
            </dt>
            <dd>{locationEntity.alternateName}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="serviceNetApp.location.description">Description</Translate>
              </span>
            </dt>
            <dd>{locationEntity.description}</dd>
            <dt>
              <Translate contentKey="serviceNetApp.location.organization">Organization</Translate>
            </dt>
            <dd>{locationEntity.organizationName ? locationEntity.organizationName : ''}</dd>
            <dt>
              <span id="transportation">
                <Translate contentKey="serviceNetApp.location.transportation">Transportation</Translate>
              </span>
            </dt>
            <dd>{locationEntity.transportation}</dd>
            <dt>
              <span id="latitude">
                <Translate contentKey="serviceNetApp.location.latitude">Latitude</Translate>
              </span>
            </dt>
            <dd>{locationEntity.latitude}</dd>
            <dt>
              <span id="longitude">
                <Translate contentKey="serviceNetApp.location.longitude">Longitude</Translate>
              </span>
            </dt>
            <dd>{locationEntity.longitude}</dd>
            <dt>
              <span id="updatedAt">
                <Translate contentKey="serviceNetApp.location.updatedAt">Updated At</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={locationEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="externalDbId">
                <Translate contentKey="serviceNetApp.location.externalDbId">External Db Id</Translate>
              </span>
            </dt>
            <dd>{locationEntity.externalDbId}</dd>
            <dt>
              <span id="providerName">
                <Translate contentKey="serviceNetApp.location.providerName">Provider Name</Translate>
              </span>
            </dt>
            <dd>{locationEntity.providerName}</dd>
            <dt>
              <Translate contentKey="serviceNetApp.location.geocodingResults">Geocoding Results</Translate>
            </dt>
            <dd>
              {locationEntity.geocodingResults
                ? locationEntity.geocodingResults.map((val, i) => (
                    <span key={val.id}>
                      <a>{val.address}</a>
                      {i === locationEntity.geocodingResults.length - 1 ? '' : ', '}
                    </span>
                  ))
                : null}
            </dd>
          </dl>
          <Button tag={Link} to="/entity/location" color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/location/${locationEntity.id}/edit`} color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ location }: IRootState) => ({
  locationEntity: location.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationDetail);
