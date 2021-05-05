import { stringify } from 'querystring';
import type { Reducer, Effect } from 'umi';
import { history } from 'umi';

import { loginService, logoutService } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { setToken, removeToken } from '@/utils/axios';
import { message } from 'antd';

export type StateType = {
  status?: boolean;
  statusContent?: string;
  type?: string;
  currentAuthority?: string[];
};

export type LoginModelType = {
  namespace: string;
  state: StateType;
  effects: {
    logout: Effect;
    userLogin: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    save: Reducer<StateType>;
  };
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    statusContent: '',
  },

  effects: {
    *userLogin({ payload }, { call, put }) {
      const { success, data, message: msg } = yield call(loginService, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: success,
          currentAuthority: success ? data.authority : [],
          type: payload.type,
          statusContent: msg,
        },
      });
      if (success) {
        setToken(data.token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('登录成功！');
        let { redirect } = params as { redirect: string };
        console.log('redirect', redirect)
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    *logout(_, { call }) {
      const { redirect, token } = getPageQuery();
      const { success } = yield call(logoutService);
      if (success) {
        setAuthority([]);
        removeToken();
        if (window.location.pathname !== '/user/login' && !redirect) {
          const redirectUrl = token ? window.location.href.split('?')[0] : window.location.href;
          setTimeout(() => {
            history.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: redirectUrl,
              }),
            });
          }, 100);
        }
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        statusContent: payload.statusContent,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
