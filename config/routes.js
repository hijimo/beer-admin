const routes = [
  {
    path: '/user',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/help',
    routes: [
      {
        path: '/help',
        name: 'Decoration Help',
        component: './decoration/list/help',
        // resourceKey: 'decoration',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/goods',
          },
          {
            path: '/store',
            name: 'store',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'store',
            routes: [
              {
                path: '/store',
                name: 'Store Management',
                component: './store/list',
                resourceKey: 'store',
              },
            ],
          },
          {
            path: '/decoration',
            name: 'decoration',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'decoration',
            routes: [
              {
                path: '/decoration',
                name: 'Decoration Management',
                component: './decoration/list',
                resourceKey: 'decoration',
              },
            ],
          },
          {
            path: '/category',
            name: 'category',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'category',
            routes: [
              {
                path: '/category',
                name: 'Category Management',
                component: './category/list',
                resourceKey: 'category',
              },
            ],
          },
          {
            path: '/price',
            name: 'price',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'price',
            routes: [
              {
                path: '/price',
                name: 'Price Management',
                component: './price/list',
                resourceKey: 'price',
              },
            ],
          },
          {
            path: '/country',
            name: 'country',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'country',
            routes: [
              {
                path: '/country',
                name: 'Country Management',
                component: './country/list',
                resourceKey: 'country',
              },
            ],
          },
          {
            path: '/rank',
            name: 'rank',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'rank',
            routes: [
              {
                path: '/rank',
                name: 'Rank Management',
                component: './rank/list',
                resourceKey: 'rank',
              },
            ],
          },
          {
            path: '/goods',
            name: 'goods',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'goods',
            routes: [
              {
                path: '/goods',
                name: 'Goods Management',
                component: './goods/list',
                resourceKey: 'goods',
              },
            ],
          },
          {
            path: '/home',
            name: 'Home',
            icon: 'home',
            Routes: ['sm-common/components/PageAuthorized'],
            component: './home',
            resourceKey: 'home',
          },
          {
            path: '/product',
            name: 'Product Management',
            icon: 'apartment',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'product',
            routes: [
              {
                path: '/product/add',
                name: 'Add Product',
                component: './product/Add',
                resourceKey: 'productAdd',
              },
              {
                path: '/product/MyProduct',
                name: 'My Product',
                component: './product/myProduct',
                resourceKey: 'productList',
              },
              {
                path: '/product/MyProduct/:spuId/edit',
                hideInMenu: true,
                name: 'Edit Product',
                component: './product/Edit',
                resourceKey: 'productEdit',
              },
              {
                path: '/product/MyProduct/:spuId/detail',
                hideInMenu: true,
                name: 'Product Detail',
                component: './product/Detail',
                resourceKey: 'productDetail',
              },
              {
                path: '/product/CategoryGroup',
                name: 'Category Group',
                component: './product/categoryGroup',
                resourceKey: 'groupList',
              },
              {
                path: '/product/CategoryGroup/:groupId',
                hideInMenu: true,
                name: 'Product List',
                component: './product/productList',
                resourceKey: 'groupDetail',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/rfq',
            name: 'RFQ',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'rfq',
            routes: [
              {
                path: '/rfq',
                name: 'RFQ Management',
                component: './RFQ/RFQManagement',
                resourceKey: 'rfq',
              },
              {
                path: '/rfq/:id/detail',
                hideInMenu: true,
                name: 'RFQ Details',
                component: './RFQ/RFQDetails',
                resourceKey: 'rfqDetail',
              },
              {
                path: '/rfq/:inquiryNo/Quote',
                hideInMenu: true,
                name: 'Quote',
                component: './RFQ/Quote',
                resourceKey: 'rfqQuote',
              },
            ],
          },
          {
            path: '/po',
            name: 'PO',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'po',
            routes: [
              {
                path: '/po',
                name: 'PO Management',
                component: './PO/POManagement',
                resourceKey: 'po',
              },
              {
                path: '/po/:id/detail',
                hideInMenu: true,
                name: 'PO Details',
                component: './PO/PODetails',
                resourceKey: 'poDetail',
              },
            ],
          },
          {
            path: '/QCManagement',
            name: 'Quality Control',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'qc',
            routes: [
              {
                path: '/QCManagement',
                name: 'Quality Control',
                component: './QCManagement/productQC',
                resourceKey: 'qc',
              },
              {
                path: '/QCManagement/productQC/:id/detail',
                hideInMenu: true,
                name: 'QC Details',
                component: './QCManagement/QCDetails',
                resourceKey: 'qcDetail',
              },
            ],
          },
          {
            path: '/sample',
            name: 'Sample Management',
            icon: 'user',
            component: './sample/sampleManagement',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'sample',
          },
          {
            path: '/sample/:id/detail',
            hideInMenu: true,
            name: 'Sample Details',
            component: './sample/detail',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'sampleDetail',
          },
          {
            path: '/inquiry',
            name: 'inquiry',
            icon: 'smile',
            component: './inquiry/list',
            // Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'inquiry',
          },
          {
            path: '/inquiry/:id/detail',
            name: 'detail',
            component: './inquiry/detail',
            hideInMenu: true,
            // Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'inquiryDetail',
          },
          {
            path: '/expo',
            name: 'Expo',
            icon: 'audit',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'expo',
            routes: [
              {
                path: '/expo/myExpo',
                name: 'My Expo',
                component: './expo/myExpo',
                resourceKey: 'expoList',
              },
              {
                path: '/expo/expoProducts',
                name: 'Expo Products',
                component: './expo/expoProducts',
                resourceKey: 'expoProductList',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/favorites',
            name: 'Favorites',
            icon: 'audit',
            component: './favorites',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'favoriteList',
          },
          // {
          //   path: '/websiteManagement',
          //   icon: 'layout',
          //   name: 'Website Management',
          //   Routes: ['sm-common/components/PageAuthorized'],
          //   resourceKey: 'decoration',
          //   routes: [
          //     {
          //       path: '/websiteManagement/websiteDecoration',
          //       name: 'Website Decoration',
          //       component: './websiteManagement/website',
          //       resourceKey: 'websiteDecoration',
          //     },
          //     {
          //       path: '/websiteManagement/showroom',
          //       name: 'Showroom',
          //       component: './websiteManagement/showroom',
          //       resourceKey: 'showroomDecoration',
          //     },
          //     {
          //       component: './404',
          //     },
          //   ],
          // },
          {
            path: '/myCompany',
            name: 'My Company',
            icon: 'solution',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'company',
            routes: [
              {
                path: '/myCompany',
                name: 'My Profile',
                component: './myCompany/myProfile',
                resourceKey: 'company',
              },
              {
                path: '/myCompany/EditVerification',
                hideInMenu: true,
                name: 'Edit Verification',
                component: './myCompany/EditVerification',
                resourceKey: 'companyEditVerification',
              },
              {
                path: '/myCompany/EditProfile',
                hideInMenu: true,
                name: 'Edit Profile',
                component: './myCompany/EditProfile',
                resourceKey: 'companyEditProfile',
              },
              {
                path: '/myCompany/EditQualityChina',
                hideInMenu: true,
                name: 'Edit Quality China',
                component: './myCompany/EditQualityChina',
                resourceKey: 'companyEditQualityChina',
              },
              {
                path: '/myCompany/Verification',
                hideInMenu: true,
                name: 'Verification',
                component: './myCompany/Verification',
                resourceKey: 'companyVerification',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/message',
            name: 'Message',
            icon: 'user',
            component: './message',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'messageList',
          },
          {
            path: '/authManage',
            name: 'authManage',
            icon: 'smile',
            Routes: ['sm-common/components/PageAuthorized'],
            resourceKey: 'auth',
            routes: [
              {
                path: '/authManage/roleManage',
                name: 'roleManage',
                icon: 'smile',
                component: './authorization/role',
                resourceKey: 'role',
              },
              {
                path: '/authManage/userManage',
                name: 'userManage',
                icon: 'smile',
                component: './authorization/user',
                resourceKey: 'user',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/account',
            name: 'Account',
            icon: 'user',
            Routes: ['sm-common/components/PageAuthorized'],
            component: './account',
            resourceKey: 'accountDetail',
          },
          {
            path: '/fail',
            name: 'Fail',
            hideInMenu: true,
            component: './fail',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];

export default routes;
