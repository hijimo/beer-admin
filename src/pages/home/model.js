import { queryHomeData } from '@/services/home';

const Model = {
  namespace: 'home',
  state: {
    homeData: {},
  },
  effects: {
    *fetchHomeData({ payload }, { call, put }) {
      const res = yield call(queryHomeData, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveHomeData',
          payload: data,
        });
      }
    },
  },
  reducers: {
    saveHomeData(state, { payload }) {
      return { ...state, homeData: payload };
    },
  },
};
export default Model;
