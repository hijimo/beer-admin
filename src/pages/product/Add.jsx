import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import ProductDetail from './components';

@connect()
class AddProduct extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'common/initCategoryAttributes', payload: null });
  }

  render() {
    return (
      <PageHeaderWrapper>
        <ProductDetail />
      </PageHeaderWrapper>
    );
  }
}

export default AddProduct;
