export { FormItemLayoutInterface, LayoutInterface } from './layout';

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface BaseBean {
  id: number;
  dtCreaDateTime: number | string;
  dtUpdateDateTime: number | string;
  isDel?: string;
  isUse?: number;
  remark?: string;
  showOrder?: number;
}

export enum FormModeEnum {
  create = 'create',
  update = 'update',
  view = 'view',
}

export enum FormModeLabelEnum {
  create = '新建',
  update = '修改',
  view = '查看',
}
