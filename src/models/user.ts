import { Effect, Reducer } from 'umi';
import { query as queryUsers, getUserInfoService } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { setToken, getToken } from '@/utils/axios';

export interface CurrentUser {
  avatar?: string;
  userName?: string;
  nickname?: string;
  createTime?: string;
  gender?: string;
  loginIp?: string;
  loginTime?: string;
  phone?: string;
  userType?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  id?: string;
  unreadCount?: number;
  userRoles?: number[];
  loginName?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const { token } = getPageQuery();
      const { success, data, message } = yield call(getUserInfoService, token || '');
      if (token) {
        setToken(token as string);
      }
      if (success) {
        yield put({
          type: 'saveCurrentUser',
          payload: data.user,
        });
      }
      return { success, data, message };
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
