import {
  fetchProductList,
  queryProductDetail,
  fetchCategoryGroup,
  queryProductGroup,
} from '@/services/product';

const Model = {
  namespace: 'product',

  state: {
    myProduct: {
      list: [],
      pagination: {},
    },
    productDetail: null,
    categoryGroup: null,
    productGroup: null,
    productList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 获取My Product数据
    *fetchMyProduct(_, { call, put }) {
      const res = yield call(fetchProductList, _.payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'initProductPage',
          payload: data,
        });
      }
    },

    *productDetailQuery(_, { call, put }) {
      const { success, data } = yield call(queryProductDetail, _.payload);
      if (success) {
        yield put({
          type: 'initProductDetail',
          payload: data,
        });
      }
    },

    // 获取category group数据
    *fetchCategoryGroup(_, { call, put }) {
      const res = yield call(fetchCategoryGroup, _.payload);
      const { success, data } = res;
      if (success) {
        const newData = data.map(item => {
          const { children } = item;
          return children && children.length
            ? item
            : Object.assign({}, item, {
                children: null,
              });
        });
        yield put({
          type: 'initCategoryGroup',
          payload: newData,
        });
      }
    },

    // add页面获取product group数据
    *productGroupQuery(_, { call, put }) {
      const { success, data } = yield call(queryProductGroup, _.payload);
      if (success) {
        const fun = newData => {
          if (Array.isArray(newData)) {
            for (const d of newData) {
              fun(d);
            }
            return;
          }
          if (newData) {
            newData.title = newData.name;
            newData.value = newData.id;
          }
          if (newData.children) {
            for (const d of newData.children) {
              fun(d);
            }
          }
        };
        fun(data);
        yield put({
          type: 'initProductGroup',
          payload: data,
        });
      }
    },

    // 获取Product List数据
    *fetchProductList(_, { call, put }) {
      const res = yield call(fetchProductList, _.payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'initProductList',
          payload: data,
        });
      }
    },
  },

  reducers: {
    initProductPage(state, { payload }) {
      return {
        ...state,
        myProduct: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    initProductDetail(state, { payload }) {
      return {
        ...state,
        productDetail: payload,
      };
    },
    initCategoryGroup(state, { payload }) {
      return {
        ...state,
        categoryGroup: payload,
      };
    },
    initProductGroup(state, { payload }) {
      return {
        ...state,
        productGroup: payload,
      };
    },
    initProductList(state, { payload }) {
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
  },
};

export default Model;
