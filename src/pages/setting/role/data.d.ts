import type { BaseEntity } from '@/data';

export type RoleEntity = {
  roleNo?: string; // 角色编号
  roleType?: string; // 角色类型
  roleName: string; // 角色名称
  roleRights?: string[]; // 权限列表
  authority?: string[]; // 权限回显
} & BaseEntity;

export type RoleParams = {
  roleName?: string;
  id?: string;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
