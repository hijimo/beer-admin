import { fetchWebsitDetail, fetchWebsiteInfo } from '@/services/website';

const Model = {
  namespace: 'website',

  state: {
    detail: [],
    websiteInfo: null,
    stagedFormData: [],
    // displayInfo: null,
  },

  effects: {
    *fetchDetail(_, { call, put }) {
      const res = yield call(fetchWebsitDetail, _.payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'initDetail',
          payload: data,
        });
      }
    },
    *fetchInfo(_, { call, put }) {
      const res = yield call(fetchWebsiteInfo, _.payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'initInfo',
          payload: data,
        });
      }
    },
  },

  reducers: {
    initDetail(state, { payload }) {
      // const displayInfo = {};
      // payload.forEach(({ epwWidgetCode, display }) => {
      //   displayInfo[epwWidgetCode] = display;
      // });
      return {
        ...state,
        detail: payload,
        // displayInfo,
      };
    },
    initInfo(state, { payload }) {
      return {
        ...state,
        websiteInfo: payload,
      };
    },
    initStage(state, { payload }) {
      return {
        ...state,
        stagedFormData: payload,
      };
    },
  },
};

export default Model;
