import request from 'umi-request';

export const queryProductQC = params => request('/api/spitfire/qc/page/query', { params });

export const queryQcDetail = params => request('/api/spitfire/qc/report/detail', { params });
