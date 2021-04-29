import request from '@/utils/axios';
import { UserParams, UserEntity } from '@/pages/setting/user/data';

export async function getAllUserService(params: UserParams) {
  return request(`/server/api/sysUser/account`, {
    method: 'GET',
    params,
  }).then((res: any) => {
    return {
      success: res?.success,
      data: res?.data?.data,
      total: res?.data.total,
    };
  });
}

export async function addUserService(params: UserEntity) {
  return request(`/server/api/sysUser/account`, {
    method: 'POST',
    body: params,
  });
}

export async function updateUserService(params: UserEntity) {
  return request(`/server/api/sysUser/account/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}
export async function deleteUserService(id: number) {
  return request(`/server/api/sysUser/account/${id}`, {
    method: 'DELETE',
  });
}

export async function getOrganizationService(params: UserParams) {
  return request(`/server/api/sysOrganization/organization`, {
    params,
  }).then((res: any) => {
    return {
      success: res?.success,
      data: res?.data?.data,
    };
  });
}

export async function getRoleService(params: UserParams) {
  return request(`/server/api/sysRole/role`, {
    params,
  }).then((res: any) => {
    return {
      success: res?.success,
      data: res?.data?.data,
    };
  });
}

export async function resetPasswordService(id: number) {
  return request(`/server/api/sysUser/resetPassword/${id}`, {
    method: 'PUT',
  });
}
