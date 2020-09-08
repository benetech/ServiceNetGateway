import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Input, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './data-import-report.reducer';
import { IDataImportReport } from 'app/shared/model/data-import-report.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDataImportReportDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DataImportReportDetail extends React.Component<IDataImportReportDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { dataImportReportEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="serviceNetApp.dataImportReport.detail.title">DataImportReport</Translate> [
            <b>{dataImportReportEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="numberOfUpdatedServices">
                <Translate contentKey="serviceNetApp.dataImportReport.numberOfUpdatedServices">Number Of Updated Services</Translate>
              </span>
            </dt>
            <dd>{dataImportReportEntity.numberOfUpdatedServices}</dd>
            <dt>
              <span id="numberOfCreatedServices">
                <Translate contentKey="serviceNetApp.dataImportReport.numberOfCreatedServices">Number Of Created Services</Translate>
              </span>
            </dt>
            <dd>{dataImportReportEntity.numberOfCreatedServices}</dd>
            <dt>
              <span id="numberOfUpdatedOrgs">
                <Translate contentKey="serviceNetApp.dataImportReport.numberOfUpdatedOrgs">Number Of Updated Orgs</Translate>
              </span>
            </dt>
            <dd>{dataImportReportEntity.numberOfUpdatedOrgs}</dd>
            <dt>
              <span id="numberOfCreatedOrgs">
                <Translate contentKey="serviceNetApp.dataImportReport.numberOfCreatedOrgs">Number Of Created Orgs</Translate>
              </span>
            </dt>
            <dd>{dataImportReportEntity.numberOfCreatedOrgs}</dd>
            <dt>
              <span id="startDate">
                <Translate contentKey="serviceNetApp.dataImportReport.startDate">Start Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={dataImportReportEntity.startDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="endDate">
                <Translate contentKey="serviceNetApp.dataImportReport.endDate">End Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={dataImportReportEntity.endDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="jobName">
                <Translate contentKey="serviceNetApp.dataImportReport.jobName">Job Name</Translate>
              </span>
            </dt>
            <dd>{dataImportReportEntity.jobName}</dd>
            <dt>
              <span id="errorMessageLabel">
                <Translate contentKey="serviceNetApp.dataImportReport.errorMessage" />
              </span>
            </dt>
            <dd>
              <Input disabled type="textarea" name="errorMessage" value={dataImportReportEntity.errorMessage} id="errorMessage" />
            </dd>
            <dt>
              <Translate contentKey="serviceNetApp.dataImportReport.documentUpload">Document Upload</Translate>
            </dt>
            <dd>{dataImportReportEntity.documentUploadId ? dataImportReportEntity.documentUploadId : ''}</dd>
            <dt>
              <Translate contentKey="serviceNetApp.dataImportReport.organizationErrors">Organization Errors</Translate>
            </dt>
            <dd>
              <Table responsive>
                <thead>
                  <tr>
                    <th>
                      <Translate contentKey="serviceNetApp.organizationError.organization">Organization</Translate>{' '}
                    </th>
                    <th>
                      <Translate contentKey="serviceNetApp.organizationError.entityName">Entity Name</Translate>{' '}
                    </th>
                    <th>
                      <Translate contentKey="serviceNetApp.organizationError.fieldName">Field Name</Translate>{' '}
                    </th>
                    <th>
                      <Translate contentKey="serviceNetApp.organizationError.externalDbId">External Db Id</Translate>{' '}
                    </th>
                    <th>
                      <Translate contentKey="serviceNetApp.organizationError.cause">Cause</Translate>
                    </th>
                    <th>
                      <Translate contentKey="serviceNetApp.organizationError.invalidValue">Invalid Value</Translate>{' '}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataImportReportEntity.organizationErrors &&
                    dataImportReportEntity.organizationErrors.map((organizationError, i) => (
                      <tr key={`entity-${i}`}>
                        <td>
                          {organizationError.organization ? (
                            <Link to={`/entity/organization/${organizationError.organization.id}`}>
                              {organizationError.organization.name}
                            </Link>
                          ) : (
                            ''
                          )}
                        </td>
                        <td>{organizationError.entityName}</td>
                        <td>{organizationError.fieldName}</td>
                        <td>{organizationError.externalDbId}</td>
                        <td>{organizationError.cause}</td>
                        <td>{organizationError.invalidValue}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </dd>
          </dl>
          <Button tag={Link} to="/entity/data-import-report" color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/data-import-report/${dataImportReportEntity.id}/edit`} color="primary">
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

const mapStateToProps = ({ dataImportReport }: IRootState) => ({
  dataImportReportEntity: dataImportReport.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataImportReportDetail);
