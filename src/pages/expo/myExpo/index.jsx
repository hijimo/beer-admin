import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import React, { Component } from 'react';
import Expoing from './components/Expoing';
import Application from './components/Application';

const TABS = {
  MY_EXPO: 'myExpo',
  APPLICATION: 'application',
};

@connect()
class MyExpo extends Component {
  state = {
    tabActiveKey: this.props.location.query.tab || TABS.MY_EXPO,
  };

  constructor(props) {
    super(props);
    this.initFormValue();
  }

  initFormValue = () => {
    const { dispatch } = this.props;
    if (this.props.location.query.tab) {
      dispatch({
        type: 'expo/setAppFormValues',
        payload: { auditStatus: 0 },
      });
    }
  };

  onTabChange = tabActiveKey => {
    const { dispatch } = this.props;
    this.setState({ tabActiveKey });
    dispatch({
      type: 'expo/setAppFormValues',
      payload: {},
    });
  };

  render() {
    const { location } = this.props;
    const { tabActiveKey } = this.state;

    const tabList = [
      {
        key: TABS.MY_EXPO,
        tab: formatMessage({ id: 'my-expo.tab.myExpo' }),
      },
      {
        key: TABS.APPLICATION,
        tab: formatMessage({ id: 'my-expo.tab.application' }),
      },
    ];

    return (
      <PageHeaderWrapper
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        tabList={tabList}
      >
        <Card bordered={false}>
          {tabActiveKey === TABS.MY_EXPO ? <Expoing /> : <Application location={location} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MyExpo;
