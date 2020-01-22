import { message } from 'antd';
import router from 'umi/router';
import {getUser, clearLocalStorage} from '@/utils/ls'

import { getCurrentUser as queryCurrent, logout as userLogout, login,getUserList } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: null,
    data: [],
    pagination: {},
  },
  effects: {
    *getDataList({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
      
        yield put({
          type: 'saveData',
          payload: {
            ...response,
            pageSize:payload.pageSize,
            pageNum: payload.pageNum
          },
        });
      
    },
    *login({ payload }, { call }) {
      const response = yield call(login, payload);
      return response;
    },
    *logout(_, { call, put }) {
      const u = getUser()
      const response = yield call(userLogout,  u ? u.userId : undefined);
        message.success(' Success!');
        yield put({
          type: 'saveCurrentUser',
          payload: null,
        });
        clearLocalStorage()
        router.push('/user/login');
      
      return response;
    },
    *fetchCurrent(_, { call, put }) {
      const u = getUser()
      const response = yield call(queryCurrent,  u ? u.username : undefined);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
      return response;
    },
    // 私有fetchCurrent，这个fetch不会触发loading导致页面刷新
    *fetchCurrentNoLoading(_, { call, put }) {
      const response = yield call(queryCurrent);
      const { data } = response;
      
      yield put({
        type: 'saveCurrentUser',
        payload: data,
      });
      return response;
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || null };
    },
    saveData(state, { payload }) {
      return {
        ...state,
        data: payload.rows,
        pagination: {
          total: payload.total,
          pageSize: payload.pageSize,
          current: payload.pageNum,
        },
      };
    },
  },
};
export default UserModel;
