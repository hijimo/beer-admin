import { queryProducts, queryBuyers } from '@/services/favorites';

const Model = {
  namespace: 'favorite',
  state: {
    products: {
      list: [],
      pagination: {},
    },
    buyers: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchProducts({ payload }, { call, put }) {
      const res = yield call(queryProducts, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveProducts',
          payload: data,
        });
      }
    },
    *fetchBuyers({ payload }, { call, put }) {
      const res = yield call(queryBuyers, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveBuyers',
          payload: data,
        });
      }
    },
  },
  reducers: {
    saveProducts(state, { payload }) {
      return {
        ...state,
        products: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    saveBuyers(state, { payload }) {
      return {
        ...state,
        buyers: {
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
