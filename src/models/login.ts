import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { loginService } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { setToken, removeToken } from '@/utils/axios';
import { message } from 'antd';

export interface StateType {
  status?: boolean;
  statusContent?: string;
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
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
}

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
          currentAuthority: data ? data.currentAuthority : [],
          type: payload.type,
          statusContent: msg,
        },
      });
      if (success) {
        setToken(data.token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params as { redirect: string };
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

    logout() {
      const { redirect, token } = getPageQuery();
      // Note: There may be security issues, please note
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
