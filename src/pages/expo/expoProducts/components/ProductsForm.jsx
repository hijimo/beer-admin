import { Form, Row, Col, Input, Select, Button, Icon, DatePicker } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { fetchDictList } from '@/services/profile';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FORM_KEYS = {
  PRODUCT_NAME: 'goodsName',
  EXPO_DATE: 'expoDate',
  EXPO_STATUS: 'auditStatus',
  EXPO_NAME: 'expoName',
};

@connect(({ expo }) => ({
  expandForm: expo.expoProFormExpand,
}))
class ProductsForm extends Component {
  state = {
    dictList: {},
  };

  componentDidMount() {
    this.fetchDictListMethod();
    this.setExpandForm();
  }

  fetchDictListMethod = async () => {
    const dictKey = ['audit'];
    const { success, data } = await fetchDictList(dictKey);
    if (success) {
      this.setState({ dictList: data });
    }
  };

  setExpandForm = () => {
    const { dispatch } = this.props;
    const { status } = this.props.location.query;
    if (status) {
      dispatch({
        type: 'expo/toggleExpoProForm',
        payload: true,
      });
    }
  };

  toggleForm = () => {
    const { dispatch, expandForm } = this.props;
    dispatch({
      type: 'expo/toggleExpoProForm',
      payload: !expandForm,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.handleSearch({});
  };

  handleSearch = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const searchParams = getFieldsValue();
    const { expoDate = [] } = searchParams;
    this.props.handleSearch(
      Object.assign({}, searchParams, {
        gmtStart:
          expoDate[0] &&
          moment(expoDate[0])
            .startOf('day')
            .toISOString(),
        gmtEnd:
          expoDate[1] &&
          moment(expoDate[1])
            .endOf('day')
            .toISOString(),
        expoDate: undefined,
      }),
    );
  };

  render() {
    const { dictList } = this.state;
    const { audit = [] } = dictList;
    const {
      form: { getFieldDecorator },
      searchParams,
      expandForm,
    } = this.props;
    const rowGutter = {
      md: 8,
      lg: 24,
      xl: 24,
    };
    const renderSimpleForm = () => (
      <Form layout='inline'>
        <Row gutter={rowGutter}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'expo-products.form.product-name' })}>
              {getFieldDecorator(FORM_KEYS.PRODUCT_NAME)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'expo-products.form.expo-date' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_DATE)(
                <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              <Button type='primary' onClick={this.handleSearch}>
                <FormattedMessage id='yeeorder.search' defaultMessage='Search' />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id='yeeorder.reset' defaultMessage='Reset' />
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {`${formatMessage({ id: 'yeeorder.form.More' })} `}
                <Icon type='down' />
              </a>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
    const renderAdvancedForm = () => (
      <Form layout='inline'>
        <Row gutter={rowGutter} type='flex'>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: 'expo-products.form.product-name' })}>
              {getFieldDecorator(FORM_KEYS.PRODUCT_NAME)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: 'expo-products.form.expo-date' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_DATE)(
                <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: 'expo-products.form.status' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_STATUS, {
                initialValue: searchParams.auditStatus,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                >
                  {audit.map(({ value, text }) => (
                    <Option key={value} value={value}>
                      {text}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: 'expo-products.form.expo-name' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_NAME, {
                initialValue: searchParams.expoName,
              })(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type='primary' onClick={this.handleSearch}>
              <FormattedMessage id='yeeorder.search' defaultMessage='Search' />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              <FormattedMessage id='yeeorder.reset' defaultMessage='Reset' />
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              {`${formatMessage({ id: 'yeeorder.form.Less' })} `}
              <Icon type='up' />
            </a>
          </div>
        </div>
      </Form>
    );
    return (
      <div className='tableListForm'>{expandForm ? renderAdvancedForm() : renderSimpleForm()}</div>
    );
  }
}

export default Form.create()(ProductsForm);
