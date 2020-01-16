import { queryProductQC, queryQcDetail } from '@/services/qc';

const Model = {
  namespace: 'qc',
  state: {
    productQC: {
      list: [],
      pagination: {},
    },
    qcDetail: {},
  },
  effects: {
    *fetchProductQC({ payload }, { call, put }) {
      const res = yield call(queryProductQC, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveProductQC',
          payload: data,
        });
      }
    },
    *fetchQcDetail({ payload }, { call, put }) {
      const res = yield call(queryQcDetail, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveQcDetail',
          payload: data,
        });
      }
    },
  },
  reducers: {
    saveProductQC(state, { payload }) {
      return {
        ...state,
        productQC: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    saveQcDetail(state, { payload }) {
      return { ...state, qcDetail: payload };
    },
  },
};
export default Model;
