import { fetchInquiryDetail, fetchDialogue } from './service';

const Model = {
  namespace: 'inquiry',

  state: {
    detail: {},
    dialogue: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchInquiryDetail({ payload }, { call, put }) {
      const res = yield call(fetchInquiryDetail, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveInquiryDetail',
          payload: data,
        });
      }
    },

    *fetchDialogue({ payload }, { call, put }) {
      const res = yield call(fetchDialogue, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveDialogue',
          payload: data,
        });
      }
    },
  },

  reducers: {
    saveInquiryDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    saveDialogue(state, { payload }) {
      const {
        dialogue: { list = [] },
      } = state;
      return {
        ...state,
        dialogue: {
          list: [...list, ...payload.records],
          pagination: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    clearDialogue(state) {
      return {
        ...state,
        dialogue: {
          list: [],
          pagination: {},
        },
      };
    },
  },
};
export default Model;
