import mockjs from 'mockjs';

const getInquiryList = (req, res) => {
  const { pageNo, pageSize } = req.query;
  const result = mockjs.mock({
    data: {
      pageNo: Number(pageNo),
      pageSize: Number(pageSize),
      totalCount: 23,
      'records|10': [
        {
          'id|+1': 1,
          'inquiryNo|1': ['系统', '业务'],
          supplier: 'Guangzhou Venace Household Inc.',
          productName: 'Essential Home 2pc. Sauce Pan Set',
          gmtUpdate: '2019-10-16T10:29:52.000Z',
          'hasRead|1': [0, 1],
        },
      ],
    },
    retCode: '200',
    retMsg: '',
    success: true,
    timestamp: 1573127612292,
  });
  return res.json(result);
};

const getInquiryDetail = (_, res) => {
  const result = mockjs.mock({
    data: {
      id: 1,
      contactNo: '26498270980',
      productPhoto: {
        url:
          'https://img.test.yeeorder.com.cn/img/im/2019/12/27/3e6c1940-2883-11ea-9de3-8390b0754672.jpg',
        uid: 'sdfasf',
        name: 'cr7.jpeg',
      },
      productName: 'For iphone X 9H 0.33mm 2.5D Privacy Film Anti spy anti peeping tempered glass',
      productSpec:
        'tempered glass  Privacy Film Anti spy anti peeping Privacy tempered glass  Privacy Film Anti spy anti peeping Privacy',
      productPrice: 12000,
      productPriceText: '$12,000',
      uom: 1,
      unitText: 'Unit',
      moq: 12000,
      moqText: '12000 Unit',
      companyName: 'Jarvis Zhao Jiangsu Skyplant Greenhouse Technology Co., Ltd.',
      companyContact: 'Jack',
      productQuantity: 1000,
      productQuantityText: '1,000',
      gmtCreate: '2019-10-16T10:29:52.000Z',
      contactInfo: `Dear Sir,
        Hope you are doing well!
        This is James from ABC LLC. We are a trading company with offices in Europe
        and Latin America.
        We need Polished Floor Tiles.
        Dark Black Color: 795 pcs of 1000*1000/mm and 125 pcs of`,
      creatorName: 'Linda',
      categoryId: [1069, 1095, 1096],
      currency: 1,
    },
    retCode: '200',
    retMsg: '',
    success: true,
    timestamp: 1573127612292,
  });
  return res.json(result);
};

const getDialogue = (req, res) => {
  const { pageNo, pageSize } = req.query;
  const result = mockjs.mock({
    data: {
      'records|10': [
        {
          'id|+1': 1,
          'isme|1': [0, 1],
          'creatorName|1': ['Linda', 'Jack'],
          gmtUpdate: '2019-10-16T10:29:52.000Z',
          productName:
            'For iphone X 9H 0.33mm 2.5D Privacy Film Anti spy anti peeping tempered glass',
          productQuantity: '1,000',
          uomText: 'pieces',
          contactInfo: `Dear Sir,
          Hope you are doing well!
          This is James from ABC LLC. We are a trading company with offices in Europe
          and Latin America.
          We need Polished Floor Tiles.
          Dark Black Color: 795 pcs of 1000*1000/mm and 125 pcs of`,
          'attachmentVOList|10': [
            {
              version: null,
              'uid|+1': 1,
              name: 'cr7.jpeg',
              url:
                'https://img.test.yeeorder.com.cn/img/im/2020/1/6/65599ab0-3066-11ea-9c8e-b13699b326b7.jpeg',
              size: '327663',
            },
          ],
        },
      ],
      pageNo: Number(pageNo),
      pageSize: Number(pageSize),
      totalCount: 24,
    },
    retCode: '200',
    retMsg: '',
    success: true,
    timestamp: 1573127612292,
  });
  return res.json(result);
};

const getProduct = (req, res) => {
  const { pageNo, pageSize } = req.query;
  const result = mockjs.mock({
    data: {
      'records|10': [
        {
          'id|+1': 1,
          'isme|1': [0, 1],
          'creatorName|1': ['Linda', 'Jack'],
          gmtUpdate: '2019-10-16T10:29:52.000Z',
          productName:
            'For iphone X 9H 0.33mm 2.5D Privacy Film Anti spy anti peeping tempered glass',
          productQuantity: '1,000',
          uomText: 'pieces',
          contactInfo: `Dear Sir,
          Hope you are doing well!
          This is James from ABC LLC. We are a trading company with offices in Europe
          and Latin America.
          We need Polished Floor Tiles.
          Dark Black Color: 795 pcs of 1000*1000/mm and 125 pcs of`,
          'attachmentVOList|10': [
            {
              version: null,
              'uid|+1': 1,
              name: 'cr7.jpeg',
              url:
                'https://img.test.yeeorder.com.cn/img/im/2020/1/6/65599ab0-3066-11ea-9c8e-b13699b326b7.jpeg',
              size: '327663',
            },
          ],
        },
      ],
      pageNo: Number(pageNo),
      pageSize: Number(pageSize),
      totalCount: 30,
    },
    retCode: '200',
    retMsg: '',
    success: true,
    timestamp: 1573127612292,
  });
  return res.json(result);
};

const success = mockjs.mock({
  data: null,
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

const getInquiryInit = mockjs.mock({
  data: {
    contactNo: '26498270980',
    contactId: 123,
    companyName: 'Jarvis Zhao Jiangsu Skyplant Greenhouse Technology Co., Ltd.',
    companyContact: 'Jack',
    supplierPhoto: {
      url:
        'https://img.test.yeeorder.com.cn/img/im/2019/12/27/3e6c1940-2883-11ea-9de3-8390b0754672.jpg',
      uid: 'sdfasf',
      name: 'cr7.jpeg',
    },
    supplierTelephone: '0086-21-6764 456',
  },
  retCode: '200',
  retMsg: '',
  success: true,
  timestamp: 1573127612292,
});

export default {
  'GET /api/mustang/inquiry/page/query': getInquiryList,
  'GET /api/mustang/contact/query/detail': getInquiryDetail,
  'GET /api/mustang/contact/query/info/detail': getDialogue,
  'POST /api/mustang/inquiry/message/send': success,
  'GET /api/mustang/product/company_spu/page/query': getProduct,
  'GET /api/mustang/order/query/init/contact': getInquiryInit,
};
