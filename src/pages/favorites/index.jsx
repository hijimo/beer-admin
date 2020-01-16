import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Products from './products';
import Buyers from './buyers';
import styles from './style.less';

const TABS = {
  Products: 'products',
  Buyers: 'buyers',
};

class Favorites extends Component {
  state = {
    tabActiveKey: TABS.Products,
  };

  onTabChange = tabActiveKey => {
    this.setState({ tabActiveKey });
  };

  render() {
    const { tabActiveKey } = this.state;

    const tabList = [
      {
        key: TABS.Products,
        tab: formatMessage({ id: 'favorites.tab.products' }),
      },
      {
        key: TABS.Buyers,
        tab: formatMessage({ id: 'favorites.tab.buyers' }),
      },
    ];

    return (
      <PageHeaderWrapper
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        tabList={tabList}
      >
        <Card className={styles.favorites} bordered={false}>
          {tabActiveKey === TABS.Products ? <Products /> : <Buyers />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Favorites;
