import { message } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  submitVerification,
  editVerification,
  editProfile,
  editQChinaWithoutLicense,
  editQChinaWithLicense,
  verifiedCheck,
} from '@/services/profile';

const Model = {
  namespace: 'myCompany',
  state: {
    verifyStatus: null,
  },
  effects: {
    *verifiedCheck(_, { call, put }) {
      const { data } = yield call(verifiedCheck);
      yield put({
        type: 'setVerifiedStatus',
        payload: data,
      });
    },
    *submitVerification({ payload }, { call }) {
      const { success } = yield call(submitVerification, payload);
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        router.push('/myCompany');
      }
    },
    *editVerification({ payload }, { call }) {
      const { success } = yield call(editVerification, payload);
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        router.push('/myCompany');
      }
    },
    *editProfile({ payload }, { call }) {
      const { success } = yield call(editProfile, payload);
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        router.push('/myCompany?tab=profile');
      }
    },
    *editQChinaWithoutLicense({ payload }, { call }) {
      const { success } = yield call(editQChinaWithoutLicense, payload);
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        router.push('/myCompany?tab=qualityChina');
      }
    },
    *editQChinaWithLicense({ payload }, { call }) {
      const { success } = yield call(editQChinaWithLicense, payload);
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        router.push('/myCompany?tab=qualityChina');
      }
    },
  },
  reducers: {
    setVerifiedStatus(state, action) {
      return {
        ...state,
        verifyStatus: action.payload,
      };
    },
  },
};
export default Model;
