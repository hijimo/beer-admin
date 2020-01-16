import mockjs from 'mockjs';

const categoryList = mockjs.mock({
  'list|10': [
    {
      'id|+1': 1,
      groupName: '@name',
      updateDate: '@date',
      firstCategory: '@word',
      type: 1,
      'attr|0-1': ['color', 'size', 'type'],
      'children|2-5': [
        {
          'id|+1': 11,
          updateDate: '@date',
          firstCategory: '@word',
          type: 2,
          groupName: '@name',
          'attr|0-1': ['color', 'size', 'type'],
          'children|2-5': [
            {
              'id|+1': 100,
              updateDate: '@date',
              type: 3,
              groupName: '@name',
              'attr|0-1': ['color', 'size', 'type'],
            },
          ],
        },
      ],
    },
  ],
  total: 100,
});

const productList = mockjs.mock({
  'list|10': [
    {
      'key|+1': 1,
      'id|+1': 1,
      productNo: '@integer(0)',
      productNumber: '@integer(0)',
      product: 'product',
      productName: 'Embroidery 2018 Design Polo T shirt 100% Cotton O',
      category: 'Clothing & Shoes & Accessory » Clothing » Men’s Clot',
      group: 'Clothing » Men Clothing Clothing » Women Clothing',
      status: 'In Sale',
      lastUpdate: '@date',
      statusText: 'Success Pull off',
    },
  ],
  total: 100,
});

export default {
  'GET /api/categoryList': categoryList,
  'GET /api/productList': productList,
};
