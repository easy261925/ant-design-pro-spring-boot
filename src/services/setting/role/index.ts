import request from '@/utils/axios';
import type { RoleParams, RoleEntity } from '@/pages/setting/role/data';

export async function getAllRoleService(params: RoleParams) {
  return request(`/server/api/sysRole/role`, {
    method: 'GET',
    params,
  }).then((res: any) => {
    return {
      success: res?.success,
      data: res?.data?.data,
      total: res?.data?.total,
    };
  });
}

export async function addRoleService(params: RoleEntity) {
  return request(`/server/api/sysRole/role`, {
    method: 'POST',
    body: params,
  });
}

export async function updateRoleService(params: RoleEntity) {
  return request(`/server/api/sysRole/role/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}
export async function deleteRoleService(id: number) {
  return request(`/server/api/sysRole/role/${id}`, {
    method: 'DELETE',
  });
}
