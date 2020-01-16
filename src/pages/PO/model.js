import { queryPoList, queryPoDetail } from '@/services/po';

const Model = {
  namespace: 'po',
  state: {
    expandForm: false,
    poData: {
      list: [],
      pagination: {},
    },
    poDetail: {},
  },
  effects: {
    *fetchPoList({ payload }, { call, put }) {
      const res = yield call(queryPoList, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'savePoList',
          payload: data,
        });
      }
    },
    *fetchPoDetail({ payload }, { call, put }) {
      const res = yield call(queryPoDetail, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'savePoDetail',
          payload: data,
        });
      }
    },
  },
  reducers: {
    savePoList(state, { payload }) {
      return {
        ...state,
        poData: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    savePoDetail(state, { payload }) {
      return { ...state, poDetail: payload };
    },
    toggleForm(state, { payload }) {
      return { ...state, expandForm: payload };
    },
  },
};
export default Model;
