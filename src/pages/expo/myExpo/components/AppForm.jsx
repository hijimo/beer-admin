import { Form, Row, Col, Input, Select, Button, Icon, DatePicker } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { fetchDictList } from '@/services/profile';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FORM_KEYS = {
  EXPO_NAME: 'epName',
  EXPO_DATE: 'expoDate',
  EXPO_STATUS: 'auditStatus',
  APPLICATION_DATE: 'applicationDate',
};

@connect(({ expo }) => ({
  expandForm: expo.appFormExpand,
  appFormValues: expo.appFormValues,
}))
class APPForm extends Component {
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
    const { tab } = this.props.location.query;
    if (tab) {
      dispatch({
        type: 'expo/toggleAppForm',
        payload: true,
      });
    }
  };

  toggleForm = () => {
    const { dispatch, expandForm } = this.props;
    dispatch({
      type: 'expo/toggleAppForm',
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
    const { expoDate = [], applicationDate = [] } = searchParams;
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
        applicationDate:
          applicationDate[0] &&
          moment(applicationDate[0])
            .startOf('day')
            .toISOString(),
        endDate:
          applicationDate[1] &&
          moment(applicationDate[1])
            .endOf('day')
            .toISOString(),
      }),
    );
  };

  render() {
    const { dictList } = this.state;
    const { audit = [] } = dictList;
    const {
      form: { getFieldDecorator },
      expandForm,
      appFormValues,
    } = this.props;
    const gutterLayout = {
      md: 8,
      lg: 24,
      xl: 24,
    };
    const renderSimpleForm = () => (
      <Form layout='inline'>
        <Row gutter={gutterLayout} type='flex'>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'application.form.expo' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_NAME)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'application.form.expo-date' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_DATE)(
                <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ whiteSpace: 'nowrap' }}>
              <Button type='primary' onClick={this.handleSearch}>
                {formatMessage({ id: 'yeeorder.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'yeeorder.reset' })}
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
        <Row gutter={gutterLayout} type='flex'>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: 'application.form.expo' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_NAME)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: 'application.form.expo-date' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_DATE)(
                <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: 'application.form.status' })}>
              {getFieldDecorator(FORM_KEYS.EXPO_STATUS, {
                initialValue: appFormValues[FORM_KEYS.EXPO_STATUS],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                >
                  {audit.map(({ value, text }) => (
                    <Option value={value} key={value}>
                      {text}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: 'application.form.apply-date' })}>
              {getFieldDecorator(FORM_KEYS.APPLICATION_DATE)(
                <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type='primary' onClick={this.handleSearch}>
              {formatMessage({ id: 'yeeorder.search' })}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {formatMessage({ id: 'yeeorder.reset' })}
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

export default Form.create()(APPForm);
