import { querySample } from '@/services/sample';

const Model = {
  namespace: 'sample',
  state: {
    sampleData: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchSample({ payload }, { call, put }) {
      const res = yield call(querySample, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveSample',
          payload: data,
        });
      }
    },
  },
  reducers: {
    saveSample(state, { payload }) {
      return {
        ...state,
        sampleData: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
  },
};
export default Model;
