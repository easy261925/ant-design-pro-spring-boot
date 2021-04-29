import type { BaseEntity } from '@/data';
import type { OrganizationEntity } from '../organization/data';

export type UserEntity = {
  loginName: string;
  loginPass: string;
  organizationId: number;
  organizationName: string;
  userRoles: number[];
  userType: number;
  userName: string;
  nickName: string;
  gender: string;
  phone: string;
  tax: string;
  card: string;
  mail: string;
  loginIp: string;
  loginDate: string;
  loginMac: string;
  roleDtos: RoleEntity[];
  organizationDto: OrganizationEntity;
} & BaseEntity;

export type UserParams = {
  id?: string;
  loginName?: string;
  loginPass?: string;
  userType?: string;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export type RoleEntity = {
  roleNo: string;
  roleType: string;
  roleName: string;
} & BaseEntity;
