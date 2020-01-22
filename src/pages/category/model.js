import { getDetail, getList } from '@/services/category';

const Model = {
  namespace: 'category',
  state: {
    detail: {},
    data: {
      list: [],
      pagination: {},
    },
  }, 

  effects: {
    *fetchDetail({ payload }, { call, put }) {
      const res = yield call(getDetail, payload);
      const {data} = res
      if (data) {
        yield put({
          type: 'saveDetail',
          payload: {
            ...data,
          },
          
        });
      }
    },

    *fetchList({ payload }, { call, put }) {
      const res = yield call(getList, payload);
      const {data} = res
      if (data) {
        yield put({
          type: 'saveList',
          payload: {
            ...data,
            pageSize:payload.pageSize,
            pageNum: payload.pageNum
          },
        });
      }
    },
  },

  reducers: {
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    saveList(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.records,
          pagination: {
            pageNum: payload.pageNum,
            pageSize: payload.pageSize,
            total: payload.total,
          },
        },
      };
    },
    clearDialogue(state) {
      return {
        ...state,
        data: {
          list: [],
          pagination: {},
        },
      };
    },
  },
};
export default Model;
