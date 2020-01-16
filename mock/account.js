const myAccount = (req, res) =>
  res.json({
    attachment: [
      {
        name: 'logo.jpg',
        size: '9335',
        url: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
    userName: 'SupplierLi',
    email: 'liy03@ucharm.cn',
    mobile: '16537442241',
    dialogType: 'userName',
    dialogVisible: false,
  });

export default {
  'GET /api/myAccount': myAccount,
};
