import { Card, Col, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import _get from 'lodash/get';
import PageHeaderContent from './components/PageHeaderContent';
import ExtraContent from './components/ExtraContent';
import SupplierMatrix from './components/SupplierMatrix';
import PurchaseOrderData from './components/PurchaseOrderData';
import LatestPO from './components/LatestPO';
import LatestRFQ from './components/LatestRFQ';
import ActionList from './components/ActionList';
import styles from './style.less';

@connect(({ user, home, expo }) => ({
  currentUser: user.currentUser,
  homeData: home.homeData,
  expo,
}))
class Home extends Component {
  componentDidMount() {
    this.fetchHomeDataMethod();
  }

  fetchHomeDataMethod = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchHomeData',
    });
  };

  render() {
    const { currentUser } = this.props;
    const expoStat = _get(this.props.homeData, 'expoStat', {}) || {};
    const orderStat = _get(this.props.homeData, 'orderStat', {}) || {};
    const poLatest = _get(this.props.homeData, 'poLatest', []) || [];
    const purchaseOrderData = _get(this.props.homeData, 'purchaseOrderData', {}) || {};
    const rfqLatest = _get(this.props.homeData, 'rfqLatest', []) || [];
    const rfqStat = _get(this.props.homeData, 'rfqStat', {}) || {};
    const supplierMatrix = _get(this.props.homeData, 'supplierMatrix', {}) || {};
    const statData = { ...expoStat, ...orderStat, ...rfqStat };
    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={currentUser} />}
        extraContent={<ExtraContent extraData={statData} />}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24}>
            <PurchaseOrderData lineData={purchaseOrderData} />
          </Col>
          <Col xl={8} lg={24} style={{ height: '465px' }}>
            <SupplierMatrix radarData={supplierMatrix} />
          </Col>
        </Row>
        <LatestPO latestPO={poLatest} fetchData={this.fetchHomeDataMethod} />
        <LatestRFQ latestRFQ={rfqLatest} />
        <Card
          title={formatMessage({ id: 'home.Action-List' })}
          bordered={false}
          bodyStyle={{ padding: 0 }}
          style={{ marginTop: '24px' }}
          className={styles.actionList}
        ></Card>
        <Row gutter={12} style={{ marginTop: '10px' }}>
          <ActionList actionData={statData} />
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Home;
