import axios, { AxiosRequestConfig } from 'axios';
import { notification } from 'antd';
import { PROJECT_NAME } from '@/utils/CONSTANTS'

const PROJECT_TOKEN = `${PROJECT_NAME}_TOKEN`

/**
 * 获取 token （接口访问权限）
 */
const getToken = () => localStorage.getItem(PROJECT_TOKEN);

/**
 * 设置 token
 */
const setToken = (token: string) => {
  localStorage.setItem(PROJECT_TOKEN, token);
};

/**
 * 移除 token
 */
const removeToken = () => {
  localStorage.removeItem(PROJECT_TOKEN);
};

/**
 * 常见 HTTP 状态码与描述
 */
const toStatusText = (status: number) => {
  const map = {
    200: '成功 - 服务器已成功返回请求的数据',
    201: '已创建或修改 - 新建或修改数据成功',
    202: '已接受 - 一个请求已经进入后台排队（异步任务）',
    204: '删除成功 - 删除数据成功',
    400: '错误请求 - 发出的请求有错误，服务器没有进行新建或修改数据的操作',
    401: '未授权 - 用户没有权限（令牌、账号、密码错误）',
    403: '禁止 - 用户得到授权，但是访问是被禁止的',
    404: '未找到 - 发出的请求针对的是不存在的记录，服务器没有进行操作',
    405: '方法禁用 - 禁用请求中指定的方法',
    406: '不接受 - 请求的格式不可得',
    408: '请求超时 - 服务器等候请求时发生超时',
    410: '已删除 - 请求的资源被永久删除，且不会再恢复',
    412: '未满足前提条件 - 服务器未满足请求者在请求中设置的其中一个前提条件',
    413: '请求实体过大 - 服务器无法处理请求，因为请求实体过大，超出服务器的处理能力',
    414: '请求的URI过长 - 请求的URI（通常为网址）过长，服务器无法处理',
    415: '不支持的媒体类型 - 请求的格式不受请求页面的支持',
    422: '验证错误 - 当创建一个对象时，发生一个验证错误',
    500: '服务器内部错误 - 服务器发生错误，请检查服务器',
    502: '网关错误 - 错误的网关',
    503: '服务不可用 - 服务器暂时过载或维护',
    504: '网关超时 - 服务器作为网关或代理，但是没有及时从上游服务器收到请求',
  };
  return map[status];
};

interface RequestConfig {
  method?: string,
  responseType?: any,
  body?: Object,
  headers?: Object,
  cache?: boolean,
}

/**
 * request 方法，axios 的简单封装
 */
export default function request(url: string, config: AxiosRequestConfig & RequestConfig = {}) {
  axios.defaults.headers.common.token = getToken(); // 获取 token
  // axios.defaults.headers.common['Accept-Language'] = `${getLocale()};q=0.9`; // 国际化“Accept-Language:zh-CN,zh;q=0.9” => zh-CN 或 en-US
  const {
    method = 'get',
    responseType = 'json',
    body = {},
    headers = {
      'Content-Type': 'application/json'
    },
    cache = false,
    ...rest
  } = config;

  const newBody = /(put|post|patch)/i.test(method) ? { data: body } : { params: body }; // data 参数，在以下“请求类型”中可用：put, post, patch

  return axios
    .request({
      url, // URL 地址
      method, // 请求类型，get, post, put, delete...
      responseType, // 响应数据类型

      headers: {
        ...headers,
        ...(cache
          ? { 'Cache-Control': 'public, max-age=86400' }
          : { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' }),
      },

      ...newBody, // 请求参数

      ...rest, // 剩余参数
    })
    .then(response => {
      if (response.data.code === 200) {
        return response.data
      } else {
        notification.error({
          message: response.data.message,
        });
        return response.data
      }
    })
    .catch(error => {
      notification.error({
        message: `服务器异常，请稍后重试`,
      });
      return {
        success: false,
      }
    });
}

export { getToken, setToken, removeToken, toStatusText };
