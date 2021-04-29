import request from '@/utils/axios';
import { DidParams } from '@/pages/setting/dic/data';

export async function getAllDicService(params: DidParams) {
  return request(`/server/api/sysDict/sysDict`, {
    params,
  }).then((res: any) => {
    return {
      success: res?.success,
      data: res?.data?.data,
      total: res?.data?.total,
    };
  });
}

export async function createDicService(params: DidParams) {
  return request(`/server/api/sysDict/sysDict`, {
    body: params,
    method: 'POST',
  });
}

export async function updateDicService(params: DidParams) {
  return request(`/server/api/sysDict/sysDict/${params.id}`, {
    body: params,
    method: 'PUT',
  });
}

export async function deleteDicService(id: number) {
  return request(`/server/api/sysDict/sysDict/${id}`, {
    method: 'DELETE',
  });
}
