import type { BaseEntity, Pagination } from '@/data';

export type TestInterface = {
  username?: string;
  password?: string;
  textarea?: string;
  select?: string;
  multiple?: string[];
  dateRange?: string[] | number[];
  switch?: boolean;
  digit?: number;
  uploadFile?: any[];
  selectUser?: any[];
} & BaseEntity;

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<Pagination>;
};

export type TestParams = {
  username?: string;
  password?: string;
  id?: string;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
