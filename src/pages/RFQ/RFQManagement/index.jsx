import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import RFQQuote from './components/RFQQuote';
import RFQReceived from './components/RFQReceived';

const TABS = {
  RECEVIED: 'Received',
  QUOTE: 'Quote',
};

class RFQManagement extends Component {
  state = {
    tabActiveKey: TABS.RECEVIED,
  };

  onTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
  };

  render() {
    const { tabActiveKey } = this.state;

    const tabList = [
      {
        key: TABS.RECEVIED,
        tab: formatMessage({ id: 'rfq.tab.received' }),
      },
      {
        key: TABS.QUOTE,
        tab: formatMessage({ id: 'rfq.tab.quote' }),
      },
    ];

    return (
      <PageHeaderWrapper
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        tabList={tabList}
      >
        <Card bordered={false}>
          {tabActiveKey === TABS.RECEVIED ? <RFQReceived /> : <RFQQuote />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RFQManagement;
