const getLatestPO = [
  {
    key: 1,
    PONo: 'POA2019091810020104',
    PORaiseDate: '2019-09-18 16:28:38',
    lastUpdate: '2019-09-28 18:26:59',
    buyer:
      'Guangzhou Venace Household Inc.Guangzhou Venace Household Inc.Guangzhou Venace Household Inc.Guangzhou Venace Household Inc.Guangzhou Venace Household Inc.',
    incoTerms: 'FOB',
    amount: '1,024,000.000 AUD',
    status: 0,
    payStatus: '--',
  },
  {
    key: 2,
    PONo: 'POA2019091910020111',
    PORaiseDate: '2019-09-19 15:34:56',
    lastUpdate: '2019-09-28 18:26:40',
    buyer: 'Zhejiang Allbright Home Textile Co., Ltd.',
    incoTerms: 'FOB',
    amount: '1,000,000.000 USD',
    status: 1,
    payStatus: 'To be Paid',
  },
  {
    key: 3,
    PONo: 'POA2019083010013057',
    PORaiseDate: '2019-09-12 01:40:01',
    lastUpdate: '2019-09-28 18:26:07',
    buyer: 'Guangzhou Elephant Color Printing & Packaging Co., Ltd.',
    incoTerms: 'FOB',
    amount: '1,024,000.000 GBP',
    status: 2,
    payStatus: 'Payment Confirmation',
  },
];

const getLatestRFQ = [
  {
    id: 1,
    rfqNo: 'IQ2019092710000981',
    rfqReleaseDate: '2019-09-27 15:23:36',
    validTo: '2019-09-30 00:00:00',
    name: 'Custom Washed Jeans Jacket with embroidered Logo',
    logo:
      'https://haitao.nos.netease.com/5b967335f1d24b15b855321ea55ef71b1550562934827jsbh4xlh10743.jpg?imageView&thumbnail=194x194&quality=95&type=webp',
    category: 'Men Clothing Ningbo Jiangbei Ocean Star Trading Co., Ltd',
    quantity: '100 Pieces',
    address:
      'Ningbo Jiangbei Ocean Star Trading Co., Ltd.Ningbo Jiangbei Ocean Star Trading Co., Ltd',
    status: 'Quote',
  },
  {
    id: 2,
    rfqNo: 'IQ2019091910000978',
    rfqReleaseDate: '2019-09-19 19:12:49',
    validTo: '2019-09-21 23:59:59',
    name: 'Custom Washed Jeans Jacket with embroidered Logo',
    logo:
      'https://img.test.yeeorder.com.cn/improduct/2019/10/18/87fb2980-f19b-11e9-aa42-e363afec67a9.jpg',
    category: 'Clothing & Shoes & Accessory»Clothing',
    quantity: '300 Pieces',
    address: 'Guangzhou Elephant Color Printing & Packaging Co., Ltd.',
    status: 'Quote',
  },
  {
    id: 3,
    rfqNo: 'IQ2019091910000973',
    rfqReleaseDate: '2019-09-19 16:54:01',
    validTo: '2019-09-20 00:00:00',
    name: 'Custom Washed Jeans Jacket with embroidered Logo',
    logo:
      'https://img.alicdn.com/imgextra/i1/3116980358/O1CN010glq9f1EW0LaiwyWK_!!0-item_pic.jpg_430x430q90.jpg',
    category: 'Home & Livinge»Bedding',
    quantity: '500 Pieces',
    address:
      'Ningbo Jiangbei Ocean Star Trading Co., Ltd.Ningbo Jiangbei Ocean Star Trading Co., Ltd',
    status: 'Quote',
  },
];

const actionList = [
  {
    title: 'Unconfirmed',
    value: 13,
    id: 1,
  },
  {
    title: 'Undelivered',
    value: 7,
    id: 2,
  },
  {
    title: 'RFQ Received',
    value: 32,
    id: 3,
  },
  {
    title: 'My Expo',
    value: 233,
    id: 4,
  },
  {
    title: 'Expo Products',
    value: 87,
    id: 5,
  },
  {
    title: 'Exception Order',
    value: 17,
    id: 6,
  },
];

const getRadarData = () => {
  const radarOriginData = [
    {
      name: '',
      ref: 10,
      koubei: 8,
      output: 4,
      contribute: 5,
      hot: 7,
    },
  ];
  const radarData = [];
  const radarTitleMap = {
    ref: 'Avg. Response Hours',
    koubei: 'Total Trade Volume',
    output: 'Avg. LeadTime',
    contribute: 'QC Pass Rate',
    hot: 'DIFOT',
  };
  radarOriginData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'name') {
        radarData.push({
          name: item.name,
          label: radarTitleMap[key],
          value: item[key],
        });
      }
    });
  });
  return radarData;
};
export default {
  currentUser: {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
    RFQReceived: 19,
    inRFQ: 57,
    orderInProcess: 22232,
  },
  actionList,
  radarData: getRadarData(),
  getLatestPO,
  getLatestRFQ,
};
