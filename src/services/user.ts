import request from '@/utils/axios';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function getUserInfoService(): Promise<any> {
  return request(`/server/api/sysUser/getUserInfo`, { method: 'POST' });
}
