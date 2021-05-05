import request from '@/utils/axios';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function getCaptchaService(mobile: string) {
  return request(`/server/api/msmservice/sendMsg`, {
    method: 'POST',
    data: mobile,
  });
}

export async function loginService(params: LoginParamsType) {
  return request('/server/api/login/login', {
    method: 'POST',
    data: params,
  });
}

export async function logoutService() {
  return request('/server/api/login/logout', {
    method: 'POST',
  });
}
