import { Form, Input, Modal, Select, Row, Col, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { queryExpoUnClose, queryExpoGoodsIds } from '@/services/expo';
import ProductList from './ProductList';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

const FORM_KEYS = {
  EXPO_NAME: 'bizId',
  KEYWORD: 'name',
};

@connect(({ expo, user, loading }) => ({
  productList: expo.productList,
  currentUser: user.currentUser,
  tableLoading: loading.effects['expo/fetchProduct'],
}))
class AddProduct extends Component {
  state = {
    expoList: [],
    expoGoodsIds: [],
    selectedRows: [],
    searchParams: {},
  };

  componentDidMount() {
    this.fetchExpoMethod();
  }

  componentDidUpdate(preProps) {
    if (this.props.modalVisible !== preProps.modalVisible && this.props.modalVisible) {
      this.fetchExpoMethod();
      this.fetchProductMethod();
    }
  }

  fetchExpoMethod = () => {
    queryExpoUnClose().then(res => {
      const { success, data } = res;
      if (success) this.setState({ expoList: data });
    });
  };

  fetchProductMethod = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const {
      dispatch,
      currentUser: { companyNo },
    } = this.props;
    const params = {
      ...pageInfo,
      bizType: 0,
      companyType: 0,
      companyNo,
      ...this.state.searchParams,
    };
    dispatch({
      type: 'expo/fetchProduct',
      payload: params,
    });
  };

  expoNameChange = val => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const newSearchParams = Object.assign({}, getFieldsValue(), {
      bizId: val,
    });
    this.setState(
      {
        searchParams: newSearchParams,
        selectedRows: [],
      },
      async () => {
        await this.queryExpoGoodsMethod(val);
        this.fetchProductMethod();
      },
    );
  };

  queryExpoGoodsMethod = val => {
    queryExpoGoodsIds({ epId: val }).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({ expoGoodsIds: data });
      }
    });
  };

  okHandle = () => {
    const {
      handleAdd,
      form: { getFieldValue, validateFields },
    } = this.props;
    const { selectedRows } = this.state;
    const edEpId = getFieldValue(FORM_KEYS.EXPO_NAME);
    validateFields(err => {
      if (!err) {
        if (!selectedRows.length) {
          message.warning(`${formatMessage({ id: 'expo-products.add-product.warn' })}`);
        } else {
          const goodsList = selectedRows.map(({ id, picture, name, spuNo, standardType }) => ({
            goodsId: id,
            goodsMainPic: picture.url,
            goodsName: name,
            standardType,
            spuNo,
          }));
          handleAdd({
            edEpId,
            goodsList,
          });
        }
      }
    });
  };

  handleSearch = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const searchParams = getFieldsValue();
    this.setState(
      {
        searchParams,
        selectedRows: [],
      },
      () => {
        this.fetchProductMethod();
      },
    );
  };

  handleSelectRows = rows => this.setState({ selectedRows: rows });

  changePage = ({ current: pageNo, pageSize }) => this.fetchProductMethod({ pageNo, pageSize });

  handleClose = () => {
    this.setState({
      selectedRows: [],
      expoList: [],
      searchParams: {},
    });
    this.props.handleModalVisible();
  };

  render() {
    const {
      modalVisible,
      form: { getFieldDecorator },
      productList,
      tableLoading,
    } = this.props;
    const { expoList = [], expoGoodsIds = [], selectedRows = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={formatMessage({ id: 'expo-products.select-product' })}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={this.handleClose}
        width='60%'
        maskClosable={false}
      >
        <Form>
          <Row>
            <Col md={24} xl={16} xxl={12}>
              <FormItem label={formatMessage({ id: 'expo-products.form.expo-name' })}>
                {getFieldDecorator(FORM_KEYS.EXPO_NAME, {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'expo-products.form.expo-name-required' }),
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                    onChange={this.expoNameChange}
                  >
                    {expoList.map(({ id, epName }) => (
                      <Option key={id}>{epName}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={24} xl={16} xxl={12}>
              <FormItem label={formatMessage({ id: 'expo-products.select-product' })}>
                {getFieldDecorator(FORM_KEYS.KEYWORD)(
                  <Search
                    autoComplete='off'
                    placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                    onSearch={this.handleSearch}
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <ProductList
          loading={tableLoading}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          expoGoodsIds={expoGoodsIds}
          data={productList.list}
          pageconf={productList.pagination}
          changePage={this.changePage}
        />
      </Modal>
    );
  }
}

export default Form.create()(AddProduct);
