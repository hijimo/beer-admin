import mockjs from 'mockjs';

const category = require('./category');

const country = mockjs.mock({
  'data|23': [
    {
      'value|+1': 1,
      text: mockjs.Random.sentence(1),
    },
  ],
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

export default {
  'GET /api/category': (req, res) => res.json(category),
  'GET /api/spitfire/country/query': country,
};
