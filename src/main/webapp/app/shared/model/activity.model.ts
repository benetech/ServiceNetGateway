import { IConflict } from 'app/shared/model//conflict.model';
import { Moment } from 'moment';

export interface IActivity {
  accountName?: String;
  organizationId?: String;
  organizationName?: String;
  lastUpdated?: Moment;
  conflicts?: IConflict[];
  organizationMatches?: String[];
}

export const defaultValue: Readonly<IActivity> = {};
