import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Detail from './components';

@connect(({ product }) => ({
  detail: product.productDetail,
}))
class ProductDetail extends Component {
  detailComponent = React.createRef();

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'product/initProductDetail', payload: null });
  }

  componentDidMount() {
    const productSpuId = this.props.match.params.spuId;
    const { dispatch } = this.props;
    if (productSpuId) {
      dispatch({
        type: 'product/productDetailQuery',
        payload: { productSpuId },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'common/initCategoryAttributes', payload: null });
  }

  render() {
    const { detail } = this.props;
    const title = `Product No.: ${detail ? detail.spuNo : ''}`;
    return (
      <PageHeaderWrapper title={title}>
        <Detail mode={2} detail={detail} />
      </PageHeaderWrapper>
    );
  }
}

export default ProductDetail;
