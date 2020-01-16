import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import config from '@common/config';
import { getFakeCaptcha, login, logout } from '@/services/login';
import { setAuthority } from '@/utils/authority';

const { mallHost } = config;
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { success, data } = yield call(login, payload);
      if (success) {
        document.cookie = `Authorization=Bearer${data.accessToken};path=/`;
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...data,
            status: true,
            currentAuthority: 'admin',
          },
        });
        window.location.href = '/';
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call }) {
      const { success } = yield call(logout, _.payload);
      if (success) {
        message.success(formatMessage({ id: 'yeeorder.success' }));
        setTimeout(() => {
          window.location.href = `${mallHost}`;
        }, 800);
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
