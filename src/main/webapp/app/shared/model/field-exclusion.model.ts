export interface IFieldExclusion {
  id?: number;
  fields?: string;
  entity?: string;
  configId?: string;
}

export const defaultValue: Readonly<IFieldExclusion> = {};
