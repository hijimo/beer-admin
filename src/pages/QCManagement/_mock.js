import mockjs from 'mockjs';

const productQc = mockjs.mock({
  data: {
    pageNo: 1,
    pageSize: 10,
    totalCount: 23,
    'records|23': [
      {
        'qcNo|+1': 1,
        poNo: 'POM19061201',
        uploadDate: '2019-10-16T10:29:52.000Z',
        buyer: mockjs.Random.sentence(3, 5),
        uploadingParty: mockjs.Random.sentence(3, 5),
        totalQuantity: '1,000',
        inspectedQuantity: '1,000',
        failedQuantity: '1,000',
        'qcResult|1': [0, 1, 2],
      },
    ],
  },
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

const qcDetail = mockjs.mock({
  data: {
    qcNo: 1212142124,
    poNo: 'POM19061201',
    uploadDate: '2019-10-16T10:29:52.000Z',
    buyer: mockjs.Random.sentence(3, 5),
    uploadingParty: mockjs.Random.sentence(3, 5),
    totalQuantity: '1,000',
    inspectedQuantity: '1,000',
    failedQuantity: '1,000',
    remark: mockjs.Random.paragraph(1, 3),
    'qcResult|1': [0, 1, 2],
    'reportList|5': [
      {
        'id|+1': 1,
        reportName: mockjs.Random.sentence(1, 3),
        url: mockjs.Random.url(),
      },
    ],
    pageNo: 1,
    pageSize: 10,
    totalCount: 15,
    'productList|15': [
      {
        'id|+1': 1,
        productName: mockjs.Random.sentence(1, 3),
        poNo: 'QCDDF12142',
        buyer: mockjs.Random.sentence(3, 5),
        poRaiseData: '2019-10-16T10:29:52.000Z',
      },
    ],
  },
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

export default {
  'POST /api/spitfire/qc/productQC/query': productQc,
  'POST /api/spitfire/qc/detail': qcDetail,
};
