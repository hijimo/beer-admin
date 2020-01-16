import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import clone from 'clone';
import {
  fetchCategory,
  queryDict,
  queryCategoryAttribute,
  queryAddress,
  queryAddressLeaf,
  queryCountry,
  queryNotice,
} from '@/services/common';

const registedDictKeys = ['uom', 'currency', 'incoterm'];
const Model = {
  namespace: 'common',

  state: {
    categoryTree: null,
    categoryAttributes: null,
    address: null,
    addressSteps: null,
    uom: null,
    currency: null,
    incoterm: null,
    country: [],
    notice: null,
  },

  effects: {
    *fetchCategory(_, { call, put }) {
      const { success, data } = yield call(fetchCategory, _.payload);
      if (success) {
        yield put({
          type: 'initCategoryTree',
          payload: data,
        });
      }
    },

    *fetchCategoryAttributes(_, { call, put }) {
      const { success, data } = yield call(queryCategoryAttribute, _.payload);
      if (success) {
        if (!data.sales || (Array.isArray(data.sales) && !data.sales.length)) {
          message.error(`${formatMessage({ id: 'product.category-no-properties' })}`);
          yield put({
            type: 'initCategoryAttributes',
            payload: {
              sales: [],
              generals: [],
            },
          });
        } else {
          yield put({
            type: 'initCategoryAttributes',
            payload: data,
          });
        }
      }
    },

    *fetchDictValByKeys(_, { call, put }) {
      const res = yield call(queryDict, _.payload);
      if (res.success) {
        const data = {};
        _.payload.keys.forEach(key => {
          if (!registedDictKeys.some(t => t === key)) {
            throw new TypeError(`UNREGISTED KEY: ${key}`);
          }
          data[key] = res.data[key];
        });
        formatDictData(data);
        yield put({
          type: 'initDict',
          payload: data,
        });
      }
    },

    *fetchAddress(_, { call, put }) {
      const { success, data } = yield call(queryAddress, _.payload);
      if (success) {
        yield put({
          type: 'initAddress',
          payload: { data },
        });
      }
    },

    *fetchAddressLeaf(_, { call, put }) {
      const { success, data } = yield call(queryAddressLeaf, _.payload);
      if (success) {
        yield put({
          type: 'initAddress',
          payload: { pid: _.payload.pid, data },
        });
      }
    },

    *fetchCountry(_, { call, put }) {
      const { success, data } = yield call(queryCountry, _.payload);
      if (success) {
        yield put({
          type: 'initCountry',
          payload: data,
        });
      }
    },

    *fetchNotice(_, { call, put }) {
      const { success, data } = yield call(queryNotice, _.payload);
      if (success) {
        yield put({
          type: 'initNotice',
          payload: data,
        });
      }
    },
  },

  reducers: {
    initCategoryTree(state, { payload }) {
      formatCategory(payload);
      return {
        ...state,
        categoryTree: payload,
      };
    },
    initCategoryAttributes(state, { payload }) {
      return {
        ...state,
        categoryAttributes: payload,
      };
    },
    initDict(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    initAddress(state, { payload }) {
      const { pid, data } = payload;
      const address = clone(state.address);
      if (pid) {
        attachAddressLeaf(address, pid, data);
      }
      return {
        ...state,
        address: !pid ? data : address,
      };
    },
    initCountry(state, { payload }) {
      return {
        ...state,
        country: payload,
      };
    },
    initNotice(state, { payload }) {
      return {
        ...state,
        notice: payload,
      };
    },
  },
};

function formatCategory(data) {
  if (Array.isArray(data)) {
    for (const d of data) {
      formatCategory(d);
    }
    return;
  }
  if (data) {
    data.label = data.name;
    data.value = data.id;
  }
  if (data.children) {
    for (const d of data.children) {
      formatCategory(d);
    }
  }
}

function formatDictData(data) {
  Object.keys(data).forEach(key => {
    data[key].forEach(item => {
      item.label = item.text;
    });
  });
}

function attachAddressLeaf(tree, pid, data) {
  if (pid === undefined || tree === undefined) {
    return;
  }
  if (tree instanceof Array) {
    tree.forEach(item => {
      if (item.id === pid) {
        item.children = data;
        return;
      }
      if (item.children && item.children.length) {
        attachAddressLeaf(item.children, pid, data);
      }
    });
  } else if (tree && tree.id === pid) {
    tree.children = data;
  }
}

export default Model;
