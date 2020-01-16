import { Avatar, Card, Col } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { router } from 'umi';
import UnconfirmedIcon from '@/assets/un-confirmed.png';
import Undelivered from '@/assets/un-delivered.png';
import RFQReceived from '@/assets/RFQ-received.png';
import MyExpo from '@/assets/my-expo.png';
import ExpoProducts from '@/assets/expo-products.png';
import ExceptionOrder from '@/assets/exception-order.png';
import { OrderStatus } from '@/pages/PO/enum';
import styles from '../style.less';

const TABS = {
  MY_EXPO: 'myExpo',
  APPLICATION: 'application',
};
const actionConf = {
  unconfirmedNum: {
    color: '#36cbcb',
    pic: UnconfirmedIcon,
    in18: 'unconfirmed',
    path: `/po?status=${OrderStatus.Unconfirmed}`,
  },
  undeliveredNum: {
    pic: Undelivered,
    in18: 'undelivered',
    path: `/po?status=${OrderStatus.InProduction}`,
  },
  exceptionNum: {
    pic: ExceptionOrder,
    in18: 'exception-order',
    path: '/po?overdueFlag=1',
  },
  receivedNum: {
    pic: RFQReceived,
    in18: 'RFQ-received',
    path: '/rfq',
  },
  myExpoNum: {
    pic: MyExpo,
    in18: 'my-expo',
    path: `/expo/myExpo?tab=${TABS.APPLICATION}`,
  },
  productNum: {
    pic: ExpoProducts,
    in18: 'expo-products',
    path: '/expo/expoProducts?status=0',
  },
};

// const handleClick = (value, index, dispatch) => {
//   if (index === 3) {
//     dispatch({
//       type: 'expo/setTabActiveKey',
//       payload: TABS.APPLICATION,
//     });
//     dispatch({
//       type: 'expo/setAppFormValues',
//       payload: {
//         auditStatus: 0,
//       },
//     });
//   }
//   router.push(value.path);
// };

export default ({ actionData }) => (
  <>
    {Object.entries(actionConf).map(([key, value]) => (
      <Col sm={12} md={8} lg={8} xl={4} key={key}>
        <Card
          hoverable
          className={styles.actionItem}
          bordered={false}
          onClick={() => router.push(value.path)}
        >
          <h4>{actionData[key]}</h4>
          <span>{formatMessage({ id: `home.${value.in18}` })}</span>
          <Avatar
            className={styles.actionAvatar}
            style={{ background: value.color }}
            size='small'
            src={value.pic}
          />
        </Card>
      </Col>
    ))}
  </>
);
