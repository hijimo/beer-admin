import mockjs from 'mockjs';
import category from './category.json';

const verification = (req, res) => {
  res.json({
    id: '000000001',
    companyName: '友创科技有限公司',
    legalPersonName: '张华',
    socialCreditCode: '91330100202GG2SS',
    supplierId: '2387654',
    legalPersonCardNumber: '33027665126356',
    offeringFields: [333],
    validTo: '2018-09-21',
    businessLicense: [
      {
        uid: 1,
        name: 'test04.jpg',
        size: '50002',
        status: null,
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        uid: 2,
        name: 'test04.jpg',
        size: '50002',
        status: null,
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
    license: [
      {
        uid: 1,
        name: 'test04.jpg',
        size: '50002',
        status: null,
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        uid: 2,
        name: 'test04.jpg',
        size: '50002',
        status: null,
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  });
};

const qualityChina = (req, res) => {
  res.json({
    id: '000000001',
    contact: 'Jimmy',
    telphone: '837183890',
    email: '837183890@euu.com',
    yearEstablished: '20190928',
    registrationCapital: 'Hangzhou',
    officeAddress: 'zhejiang hangzhou xihu ZheShangCaiFuZhongXin',
    region: ['zhejiang', 'hangzhou', 'xihu'],
    detailAddress: 'ZheShangCaiFuZhongXin',
    businessType: 'Business Type',
    listedCompany: 'Listed Company',
    annualRevenue: 'Annual Revenue',
    employees: 'Employees',
    factorySize: 'Factory Size',
    productionLines: 'No. of Production Lines',
    equipmentNo: 'No. of Equipment',
    annualExportVolume: 'Annual Export Volume',
    annualProduction: [
      {
        key: 1,
        productName:
          'White Down Pillow Soft Pillow Core Adult Single Pillow Star Hotel Pillow A Sleeping Pillow',
        quantity: '50001',
        uom: '1',
        uomText: 'PCS',
      },
      {
        key: 2,
        productName: 'Thai Natural Latex Tatami Mattress with 5 cm Thickness',
        quantity: '50002',
        uom: '2',
        uomText: 'Unit',
      },
      {
        key: 3,
        productName:
          'Best choice for comfortable skin and naked sleep is 100% silk four-season quilt with two mother-and-child quilt cores.',
        quantity: '50003',
        uom: '3',
        uomText: 'CTN',
      },
    ],
    ourCustomer: [
      {
        id: 1,
        nameEng: 'Albania',
        name: '阿尔巴尼亚',
      },
      {
        id: 2,
        nameEng: 'CHina',
        name: '中国',
      },
      {
        id: 3,
        nameEng: 'Japen',
        name: '日本',
      },
    ],
  });
};

const categoryTree = (req, res) => {
  res.json(category);
};

const region = [
  {
    value: 1231,
    label: 'Zhejiang',
    children: [
      {
        value: 123123,
        label: 'Hangzhou',
        children: [
          {
            value: 1231233,
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 123123,
    label: 'Jiangsu',
    children: [
      {
        value: 9923,
        label: 'Nanjing',
        children: [
          {
            value: 23413,
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const uomEnum = [
  { version: null, code: '1', value: 'PCS' },
  { version: null, code: '2', value: 'Unit' },
  { version: null, code: '3', value: 'CTN' },
  { version: null, code: '4', value: 'MT' },
  { version: null, code: '5', value: 'KILO' },
  { version: null, code: '6', value: 'Pair' },
  { version: null, code: '7', value: 'PLT' },
  { version: null, code: '8', value: 'BDL' },
  { version: null, code: '9', value: 'SET' },
  { version: null, code: '10', value: 'FCL' },
  { version: null, code: '11', value: 'LCL' },
  { version: null, code: '12', value: 'CBM' },
  { version: null, code: '13', value: 'Roll' },
  { version: null, code: '14', value: 'Bundle' },
  { version: null, code: '15', value: 'Bag' },
  { version: null, code: '16', value: 'Pack' },
  { version: null, code: '17', value: 'Drums' },
  { version: null, code: '18', value: 'Crate' },
];

const country = mockjs.mock({
  'list|56': [
    {
      'id|+1': 1,
      nameEng: 'Albania',
      name: '阿尔巴尼亚',
      pinyin: 'aebny',
    },
  ],
});

const profile = (req, res) => {
  res.json({
    companyPhoto: [
      {
        name: '1.751c2529.png',
        size: '134677',
        status: 'success',
        uid: '1569382376633',
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
    companyTel: '0837-3581837',
    companyNameEng: 'Shanghai Mercury Electronic Commerce Co., Ltd.',
    contact: 'Li Yulu',
    companyWebsite: 'http://www.shuixing.com.cn/',
    businessType: 3,
    businessTypeText: 'Factory&trading',
    companyFax: '021-57435778',
    registrationCapital: '1000，000',
    companyEmail: 'bussiness@ucharm.com',
    annualRevenue: 2,
    annualRevenueText: '1 Million ~ 10 Million USD',
    yearEstablished: '2010',
    financialAccount: '62228888234722',
    employees: 800,
    businessScale: '3000+',
    factorySize: '3000',
    legalAddress: ['zhejiang', 'hangzhou', 'xihu'],
    detailAddress: '128 Xiaobo Road',
    listed: 2,
    listedText: 'Yes',
    productionLine: '5',
    equipmentNum: '20',
    annualExportVolume: '8000，000',
    annualProduction: [
      {
        key: 1,
        productName:
          'White Down Pillow Soft Pillow Core Adult Single Pillow Star Hotel Pillow A Sleeping Pillow',
        quantity: '50001',
        uom: '1',
        uomText: 'PCS',
      },
      {
        key: 2,
        productName: 'Thai Natural Latex Tatami Mattress with 5 cm Thickness',
        quantity: '50002',
        uom: '2',
        uomText: 'Unit',
      },
      {
        key: 3,
        productName:
          'Best choice for comfortable skin and naked sleep is 100% silk four-season quilt with two mother-and-child quilt cores.',
        quantity: '50003',
        uom: '3',
        uomText: 'CTN',
      },
    ],
    paymentPreference: 1,
    paymentPreferenceText: 'L/C',
    preferredPaymentTerm: 2,
    preferredPaymentTermText: '+30days',
    logisticPartner: 'Shun Feng',
    pol: 'pol',
    ourCustomer: [
      {
        id: 1,
        nameEng: 'Albania',
        name: '阿尔巴尼亚',
        pinyin: 'aebny',
      },
      {
        id: 2,
        nameEng: 'CHina',
        name: '中国',
        pinyin: 'zhongguo',
      },
      {
        id: 3,
        nameEng: 'Japen',
        name: '日本',
        pinyin: 'xiaoriben',
      },
    ],
  });
};

const businessTypeEnum = [
  { code: 1, value: 'Trading company' },
  { code: 2, value: 'FACTORY' },
  { code: 3, value: 'Factory&trading' },
];

const annualRevenueTypeEnum = [
  { code: 1, value: 'no more than 1 Million USD' },
  { code: 2, value: '1 Million ~ 10 Million USD' },
  { code: 3, value: '10 Million ~ 100 Million USD' },
  { code: 4, value: '100 Million ~ 1 Billion USD' },
  { code: 5, value: 'over 1 Billion USD' },
];

const paymentMethodEnum = [
  { code: 1, value: 'L/C' },
  { code: 2, value: 'T/T' },
  { code: 3, value: 'D/P' },
  { code: 4, value: 'D/A' },
];

const preferredPaymentTermTypeEnum = [
  { code: 1, value: 'At Sight' },
  { code: 2, value: '+30days' },
  { code: 3, value: '+45days' },
  { code: 4, value: '+60days' },
  { code: 5, value: '+90days' },
  { code: 6, value: '+120days' },
  { code: 7, value: 'Prepay' },
];

export default {
  'GET /api/verification': verification,
  'GET /api/qualityChina': qualityChina,
  'GET /api/query_2level_category_tree': categoryTree,
  'GET /api/region': region,
  'GET /api/uomEnum': uomEnum,
  'GET /api/country': country,
  'GET /api/profile': profile,
  'GET /api/businessTypeEnum': businessTypeEnum,
  'GET /api/annualRevenueTypeEnum': annualRevenueTypeEnum,
  'GET /api/paymentMethodEnum': paymentMethodEnum,
  'GET /api/preferredPaymentTermTypeEnum': preferredPaymentTermTypeEnum,
  'POST  /api/forms': (_, res) => {
    res.send({ message: 'Ok' });
  },
};
