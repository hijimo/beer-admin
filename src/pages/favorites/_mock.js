import mockjs from 'mockjs';

const products = mockjs.mock({
  data: {
    pageNo: 1,
    pageSize: 10,
    totalCount: 23,
    'records|23': [
      {
        'id|+1': 1,
        productImg: mockjs.Random.image(),
        productName: mockjs.Random.sentence(3, 5),
        category: mockjs.Random.sentence(3, 5),
        features: mockjs.Random.sentence(3, 5),
        supplier: mockjs.Random.sentence(3, 5),
        price: '200',
        priceText: '$1,200.000',
        moq: '1000',
        moqText: '1,000Units',
        'status|1': [0, 1],
      },
    ],
  },
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

const buyers = mockjs.mock({
  data: {
    pageNo: 1,
    pageSize: 10,
    totalCount: 23,
    'records|23': [
      {
        'id|+1': 1,
        companyImg: mockjs.Random.image(),
        companyName: mockjs.Random.sentence(3, 5),
        country: mockjs.Random.sentence(1),
        sourcingfields: mockjs.Random.sentence(5, 8),
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
  'POST /api/spitfire/favorite/products/query': products,
  'POST /api/spitfire/favorite/buyers/query': buyers,
  'POST /api/spitfire/favorite/products/delete': deleteMessage,
  'POST /api/spitfire/favorite/buyers/delete': deleteMessage,
};
