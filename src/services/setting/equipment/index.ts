import request from '@/utils/axios';
import { EquipmentParams, EquipmentEntity } from '@/entity';

export async function getAllService(params: EquipmentParams) {
  return request(`/server/api/equipment/equipment`, {
    params,
  }).then((res: any) => {
    return {
      success: res?.success,
      data: res?.data?.data,
      total: res?.data?.total,
    };
  });
}

export async function createService(params: EquipmentEntity) {
  return request(`/server/api/equipment/equipment`, {
    body: params,
    method: 'POST',
  });
}

export async function updateService(params: EquipmentParams) {
  return request(`/server/api/equipment/equipment`, {
    body: params,
    method: 'PUT',
  });
}

export async function deleteService(id: number) {
  return request(`/server/api/equipment/equipment/${id}`, {
    method: 'DELETE',
  });
}
