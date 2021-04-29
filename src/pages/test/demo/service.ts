import request from '@/utils/request';
import type { TestParams } from './data';

export async function getAllService(params: TestParams) {
  return request('/api/test', {
    params,
  });
}
