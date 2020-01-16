import { queryCurrent, query as queryUsers } from '@/services/user';

const UserModel = {
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
      const { data, success } = yield call(queryCurrent);
      const { userPhoto } = data;

      if (success) {
        const defaultUserPhoto =
          'https://img.test.yeeorder.com.cn/improduct/2019/10/19/e0f7e1b0-f239-11e9-9ede-85b855b76bd8.png';
        yield put({
          type: 'saveCurrentUser',
          payload: Object.assign({}, data, { userPhoto: userPhoto || defaultUserPhoto }),
        });
      }
    },
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
