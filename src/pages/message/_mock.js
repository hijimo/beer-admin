import mockjs from 'mockjs';

const message = mockjs.mock({
  data: {
    pageNo: 1,
    pageSize: 10,
    totalCount: 23,
    'records|23': [
      {
        'id|+1': 1,
        'type|1': ['系统', '业务'],
        time: '2019-10-16T10:29:52.000Z',
        message: mockjs.Random.sentence(5, 10),
        'hasRead|1': [0, 1],
      },
    ],
  },
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

const deleteMessage = {
  data: null,
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
};

export default {
  'POST /api/spitfire/message/query': message,
  'POST /api/spitfire/message/delete': deleteMessage,
  'POST /api/spitfire/message/read': deleteMessage,
};
