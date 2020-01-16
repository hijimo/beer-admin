import request from 'umi-request';

export const queryHomeData = () => request('/api/spitfire/stats/home/get');
