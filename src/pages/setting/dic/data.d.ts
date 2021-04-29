import type { BaseEntity } from '@/data';

export type DicEntity = {
  dictNo?: string; // 字典编号
  dictName?: string; // 字典名称
  groupNo?: string; // 分组编号
  dictType?: string; // 字典类别
  groupName?: string; // 分组名称
  sysDictDto?: DicEntity[]; // 子分类
} & BaseEntity;

export type DidParams = {
  id?: number;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
