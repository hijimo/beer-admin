import { queryMessage } from '@/services/message';

const Model = {
  namespace: 'message',
  state: {
    messageData: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchMessage({ payload }, { call, put }) {
      const res = yield call(queryMessage, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveMessage',
          payload: data,
        });
      }
    },
  },
  reducers: {
    saveMessage(state, { payload }) {
      return {
        ...state,
        messageData: {
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
