import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import TabWrapper from './TabWrapper';
import { TabValue, TabText } from '../enum';
import { queryStatusStaic } from '@/services/po';

@connect()
class POManagement extends Component {
  state = {
    tabValue: TabValue.All,
    statusMetrics: [],
  };

  componentDidMount() {
    this.fetchStatusStaic();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'po/toggleForm',
      payload: false,
    });
  }

  handleTabChange = tabActiveKey => this.setState({ tabValue: Number(tabActiveKey) });

  fetchStatusStaic = () => {
    queryStatusStaic().then(res => {
      const { success, data } = res;
      if (success) this.setState({ statusMetrics: data || [] });
    });
  };

  render() {
    const { tabValue, statusMetrics } = this.state;
    const { location } = this.props;
    const tabList = statusMetrics.map(({ status, statusNum }, index) => ({
      key: status,
      tab:
        index === 0
          ? `${formatMessage({ id: TabText[status].text })}`
          : `${formatMessage({ id: TabText[status].text })}(${statusNum})`,
    }));
    return (
      <PageHeaderWrapper
        tabActiveKey={tabValue.toString()}
        onTabChange={this.handleTabChange}
        tabList={tabList}
      >
        <TabWrapper
          location={location}
          activeTab={tabValue}
          fetchStatusStaic={this.fetchStatusStaic}
        />
      </PageHeaderWrapper>
    );
  }
}

export default POManagement;
