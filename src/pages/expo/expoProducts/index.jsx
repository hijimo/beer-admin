import { Button, Card, Form, message } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { addGoods, deleteGoods } from '@/services/expo';
import AddProduct from './components/AddProduct';
import StandardTable from './components/StandardTable';
import ProductsForm from './components/ProductsForm';
import Clear from './components/Clear';
import styles from '../style.less';

const getValuefromUrl = val => (val ? Number(val) : undefined);

@connect(({ expo, loading }) => ({
  expoProduct: expo.expoProduct,
  tableLoading: loading.effects['expo/fetchExpoProduct'],
  searchParams: expo.expoProFromValues,
}))
class ExpoProducts extends Component {
  state = {
    addModalVisible: false,
    selectedRows: [],
    clearVisible: false,
  };

  componentDidMount() {
    const { searchParams } = this.props;
    this.handleSearch({
      ...searchParams,
      auditStatus: getValuefromUrl(this.props.location.query.status),
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'expo/setExpoProFormValues',
      payload: {},
    });
    dispatch({
      type: 'expo/toggleExpoProForm',
      payload: false,
    });
  }

  fetchProductMethod = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch, searchParams } = this.props;
    const params = {
      ...pageInfo,
      ...searchParams,
    };
    dispatch({
      type: 'expo/fetchExpoProduct',
      payload: params,
    });
  };

  handleRemove = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    this.setState({
      clearVisible: true,
    });
  };

  clearOnOk = () => {
    const { selectedRows } = this.state;
    const ids = selectedRows.map(({ edEpId, edGoodsId, id }) => ({
      epId: edEpId,
      goodsId: edGoodsId,
      id,
    }));
    deleteGoods({ ids }).then(({ success }) => {
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        this.setState({
          selectedRows: [],
          clearVisible: false,
        });
        this.fetchProductMethod();
      }
    });
  };

  clearOnCancel = () => this.setState({ clearVisible: false });

  handleSearch = async searchParams => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'expo/setExpoProFormValues',
      payload: searchParams,
    });
    this.fetchProductMethod();
  };

  handleModalVisible = flag => this.setState({ addModalVisible: !!flag });

  handleAdd = params => {
    addGoods(params).then(res => {
      const { success } = res;
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        this.handleModalVisible();
        this.fetchProductMethod();
      }
    });
  };

  changePage = ({ current: pageNo, pageSize }) => this.fetchProductMethod({ pageNo, pageSize });

  handleSelectRows = rows => this.setState({ selectedRows: rows });

  render() {
    const { expoProduct, tableLoading, location, searchParams } = this.props;
    const { list: records } = expoProduct;
    const { selectedRows, addModalVisible, clearVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      productInExpo: records.map(item => item.id),
      modalVisible: addModalVisible,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <ProductsForm
              location={location}
              searchParams={searchParams}
              handleSearch={this.handleSearch}
            />
            <div className={styles.tableListOperator}>
              <Button icon='plus' type='primary' onClick={() => this.handleModalVisible(true)}>
                <FormattedMessage id='yeeorder.Add' defaultMessage='Add' />
              </Button>
              {selectedRows.length > 0 && (
                <Button onClick={this.handleRemove}>
                  <FormattedMessage id='yeeorder.Remove' defaultMessage='Remove' />
                </Button>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={tableLoading}
              data={expoProduct.list}
              pageconf={expoProduct.pagination}
              changePage={this.changePage}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
        <AddProduct {...parentMethods} />
        <Clear
          visible={clearVisible}
          clearOnOk={this.clearOnOk}
          clearOnCancel={this.clearOnCancel}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ExpoProducts);
