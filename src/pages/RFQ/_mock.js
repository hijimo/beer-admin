import mockjs from 'mockjs';

const rfqRecevied = mockjs.mock({
  data: {
    pageNo: 1,
    pageSize: 10,
    totalCount: 23,
    'records|10': [
      {
        'id|+1': 1,
        gmtResealeDate: '2019-10-16T10:29:52.000Z',
        gmtValidDate: '2019-10-16T10:29:52.000Z',
        inquiryNo: 'IQ2019092710000981',
        productCategory: mockjs.Random.sentence(3, 6),
        productName: mockjs.Random.sentence(2, 5),
        productPic: mockjs.Random.image(),
        productQuantity: 3234,
        productQuantityUnit: '3234 Pieces',
        purchaseName: mockjs.Random.sentence(4, 6),
        quoteSeatsStr: '12/20',
        remainTimeStr: '20Days Left',
        inquiryStatus: 'Quote',
      },
    ],
  },
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

const rfqDetail = mockjs.mock({
  data: {
    purchaseName: mockjs.Random.sentence(4, 6),
    productName: 'Custom Washed Jeans Jacket with embroidered Logo',
    'attachmentList|3': [
      {
        name: mockjs.Random.sentence(1, 2),
        'uid|+1': 1,
        url: mockjs.Random.image(),
      },
    ],
    inquiryStatus: 4,
    inquiryStatusText: 'release',
    inquiryNo: 'JHN88998100090001',
    categoryName: "Men's Clothing",
    productQuantity: 100,
    productQuantityUnit: '100 Pieces',
    gmtValidDate: '2019-10-16T10:29:52.000Z',
    gmtResealeDate: '2019-10-16T10:29:52.000Z',
    productDetails:
      'Preparing Christmas gifts,Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.Aenean euismod bibendum laoreet.',
    incoTerms: 0,
    incoTermsText: 'FCA',
    preferredPrice: '$1,000',
    paymentMethod: 0,
    paymentMethodText: 'L/C',
    cargoPort: 'ningbo',
    needSample: 0,
    needSampleText: 'No',
    gmtDeliveryDate: '2019-10-16T10:29:52.000Z',
    quotesQuantity: 100,
    quotesQuantityUnit: '100 Pieces',
    offerDetailDTO: {
      productName: 'Oster Herscher 2.5 Quart Sauce Pan with Lid in Red',
      productNo: 'P8-01',
      productPrice: '$12,000.000 / piece',
      productQuantity: '12,000 piece',
      'attachmentList|3': [
        {
          name: mockjs.Random.sentence(1, 2),
          'uid|+1': 1,
          url: mockjs.Random.image(),
        },
      ],
      minimumQuantity: '1,000',
      productDetails:
        'Preparing Christmas gifts,Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.Aenean euismod bibendum laoreet.',
      sampleInfoDetailDTO: {
        needSample: 1,
        needSampleText: 'Yes',
        offerFreeSample: 0,
        offerFreeSampleText: 'No',
        unitPrice: '0.1/piece',
        gmtDeliveryDate: '2019-10-16T10:29:52.000Z',
        remark: mockjs.Random.sentence(10, 20),
      },
    },
  },
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

export default {
  'POST /api/spitfire/rfq/back/page/received': rfqRecevied,
  'POST /api/spitfire/rfq/back/page/quote': rfqRecevied,
  'POST /api/spitfire/rfq/back/detail': rfqDetail,
};
