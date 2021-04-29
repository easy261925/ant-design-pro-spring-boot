// import request from '@/utils/axios';
import request from '@/utils/request';
import { OrganizationParams } from '@/pages/setting/organization/data';

export async function getAllServices(params: OrganizationParams) {
  // TODO
  // return request('/server/api/userservice/login', {
  //   method: 'POST',
  //   data: params,
  // });
  return request('/api/organization', {
    params,
  });
}
