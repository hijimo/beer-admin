import { queryExpo, queryApplication, queryProduct, queryExpoProduct } from '@/services/expo';

const Model = {
  namespace: 'expo',
  state: {
    myExpoData: {
      // 我参展的展会列表
      list: [],
      pagination: {},
    },
    applicationData: {
      // 我申请的展会列表
      list: [],
      pagination: {},
    },
    expoProduct: {
      // 我所有的展出商品列表
      list: [],
      pagination: {},
    },
    productList: {
      // 所有商品的列表
      list: [],
      pagination: {},
    },
    appFormExpand: false,
    expoProFormExpand: false,
    appFormValues: {},
    expoProFromValues: {},
  },
  effects: {
    *fetchExpo({ payload }, { call, put }) {
      const res = yield call(queryExpo, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveExpo',
          payload: data,
        });
      }
    },

    *fetchApplication({ payload }, { call, put }) {
      const res = yield call(queryApplication, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveApplication',
          payload: data,
        });
      }
    },

    *fetchExpoProduct({ payload }, { call, put }) {
      const res = yield call(queryExpoProduct, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveExpoProduct',
          payload: data,
        });
      }
    },

    *fetchProduct({ payload }, { call, put }) {
      const res = yield call(queryProduct, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveProduct',
          payload: data,
        });
      }
    },
  },
  reducers: {
    saveExpo(state, { payload }) {
      return {
        ...state,
        myExpoData: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    saveApplication(state, { payload }) {
      return {
        ...state,
        applicationData: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    saveExpoProduct(state, { payload }) {
      return {
        ...state,
        expoProduct: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    saveProduct(state, { payload }) {
      return {
        ...state,
        productList: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    setAppFormValues(state, { payload }) {
      return { ...state, appFormValues: payload };
    },
    toggleAppForm(state, { payload }) {
      return { ...state, appFormExpand: payload };
    },
    toggleExpoProForm(state, { payload }) {
      return { ...state, expoProFormExpand: payload };
    },
    setExpoProFormValues(state, { payload }) {
      return { ...state, expoProFromValues: payload };
    },
  },
};
export default Model;
