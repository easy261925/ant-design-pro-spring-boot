import request from '@/utils/axios';
import type { OrganizationParams, OrganizationEntity } from '@/pages/setting/organization/data';

export async function getAllService(params: OrganizationParams) {
  return request('/server/api/sysOrganization/organization', {
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
export async function addOrganizationService(params: OrganizationEntity) {
  return request('/server/api/sysOrganization/organization', {
    method: 'POST',
    data: params,
  });
}
export async function updateOrganizationService(params: OrganizationEntity) {
  return request(`/server/api/sysOrganization/organization/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function deleteOrganizationService(id: number) {
  return request(`/server/api/sysOrganization/organization/${id}`, {
    method: 'DELETE',
  });
}
