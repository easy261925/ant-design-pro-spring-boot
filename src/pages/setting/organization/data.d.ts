import type { BaseEntity } from '@/data';

export type OrganizationEntity = {
  organizationNo?: string; // 机构统一编码
  organizationName?: string; // 机构名称
  upOrganizationNo?: string; // 上级机构编号
  organizationType?: string; // 机构类型
  organizationLvl?: number;
  upId: number; // 上级机构id
  short_name?: string; // 简称
  address?: string; // 详细地址
  province?: string; // 所在省份
  city?: string; // 所在城市
  county?: string; // 所在县
  phone?: string; // 手机
  tax?: string; // 座机/传真
  mail?: 邮箱; // 座机/传真
  children?: OrganizationEntity[];
  childrenOrganizationNos?: string[]; // 子对象编号集合
  childrenOrganizationIds?: number[]; // 子对象编号集合
} & BaseEntity;

export type OrganizationParams = {
  organizationName?: string;
  organizationNo?: string;
  id?: string;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
