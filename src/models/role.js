import { getRoleList } from '@/services/roleManage';

const Role = {
  namespace: 'role',
  state: {
    data: [],
    pagination: {},
  },
  effects: {
    *getDataList({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload);
      if (response.success) {
        yield put({
          type: 'saveData',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        data: payload.records,
        pagination: {
          total: payload.totalCount,
          pageSize: payload.pageSize,
          current: payload.pageNo,
        },
      };
    },
  },
};
export default Role;
