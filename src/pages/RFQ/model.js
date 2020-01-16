import { router } from 'umi';
import {
  queryRfqRecevied,
  queryRfqQuote,
  queryRfqDetail,
  queryRfqQuoteDetail,
  fetchProductList,
} from '@/services/rfq';
import { QutoesStatus } from './enum';

const Model = {
  namespace: 'rfq',
  state: {
    rfqRecevied: {
      list: [],
      pagination: {},
    },
    rfqQuote: {
      list: [],
      pagination: {},
    },
    rfqDetail: {},
    product: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetchRfqRecevied({ payload }, { call, put }) {
      const res = yield call(queryRfqRecevied, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveRfqRecevied',
          payload: data,
        });
      }
    },
    *fetchRfqQuote({ payload }, { call, put }) {
      const res = yield call(queryRfqQuote, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'saveRfqQuote',
          payload: data,
        });
      }
    },
    *fetchRfqDetail({ payload }, { call, put }) {
      const { qutoesStatus, id } = payload;
      if (qutoesStatus === QutoesStatus.UnQutoed) {
        // 未报价
        const res = yield call(queryRfqDetail, { id });
        const { success, data } = res;
        if (success) {
          if (data) {
            yield put({
              type: 'saveRfqDetail',
              payload: {
                inquiryOperaDetailDTO: data,
              },
            });
          } else {
            router.push('/fail');
          }
        }
      } else if (qutoesStatus === QutoesStatus.HasQutoed) {
        // 已报价
        const res = yield call(queryRfqQuoteDetail, { id });
        const { success, data } = res;
        if (success) {
          if (data) {
            yield put({
              type: 'saveRfqDetail',
              payload: data,
            });
          } else {
            router.push('/fail');
          }
        }
      }
    },
    *fetchProduct({ payload }, { call, put }) {
      const res = yield call(fetchProductList, payload);
      const { success, data } = res;
      if (success) {
        yield put({
          type: 'initProduct',
          payload: data,
        });
      }
    },
  },
  reducers: {
    saveRfqRecevied(state, { payload }) {
      return {
        ...state,
        rfqRecevied: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    saveRfqQuote(state, { payload }) {
      return {
        ...state,
        rfqQuote: {
          list: payload.records,
          pagination: {
            current: payload.pageNo,
            pageSize: payload.pageSize,
            total: payload.totalCount,
          },
        },
      };
    },
    saveRfqDetail(state, { payload }) {
      return { ...state, rfqDetail: payload };
    },
    initProduct(state, { payload }) {
      return {
        ...state,
        product: {
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
