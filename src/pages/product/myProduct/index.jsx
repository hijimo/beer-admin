import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import TabWrapper from './TabWrapper';
import { CompStatus } from './enum';
import { queryStatistics } from '@/services/product';

class MyProduct extends Component {
  state = {
    compStatus: CompStatus.All,
    statusMetrics: [],
  };

  componentDidMount() {
    this.fetchStatistics();
  }

  handleTabChange = tabActiveKey => this.setState({ compStatus: Number(tabActiveKey) });

  fetchStatistics = () => {
    queryStatistics().then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({ statusMetrics: data.statusMetrics || [] });
      }
    });
  };

  render() {
    const { compStatus, statusMetrics = [] } = this.state;
    const tabList = statusMetrics.map(({ compStatus: status, compStatusText, count }) => ({
      key: status,
      tab: `${compStatusText}(${count})`,
    }));
    return (
      <PageHeaderWrapper
        tabActiveKey={compStatus.toString()}
        onTabChange={this.handleTabChange}
        tabList={tabList}
      >
        <TabWrapper activeTab={compStatus.toString()} fetchStatistics={this.fetchStatistics} />
      </PageHeaderWrapper>
    );
  }
}

export default MyProduct;
