import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import ProductDetail from './components';

@connect(({ product }) => ({
  detail: product.productDetail,
}))
class EditProduct extends Component {
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
    return (
      <PageHeaderWrapper>
        <ProductDetail mode={1} detail={detail} />
      </PageHeaderWrapper>
    );
  }
}
export default EditProduct;
