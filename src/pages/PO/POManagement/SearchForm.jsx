import { Form, Row, Col, Input, Select, Button, Icon, DatePicker } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { FormKeys, TabValue, TabText } from '../enum';
import { fetchStatusEnums } from '@/services/po';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { PONo, PORaiseDate, Buyer, Status, Overdue } = FormKeys;

@connect(({ po }) => ({
  expandForm: po.expandForm,
}))
class POSearchForm extends Component {
  state = {
    statusEnums: [],
  };

  componentDidMount() {
    this.fetchStatusEnumsMethod();
    this.setExpandForm();
  }

  setExpandForm = () => {
    const { dispatch } = this.props;
    const { status, overdueFlag } = this.props.location.query;
    if (status || overdueFlag) {
      dispatch({
        type: 'po/toggleForm',
        payload: true,
      });
    }
  };

  fetchStatusEnumsMethod = () => {
    fetchStatusEnums().then(({ success, data }) => {
      if (success) this.setState({ statusEnums: data.orderStatusEnumList });
    });
  };

  toggleForm = () => {
    const { dispatch, expandForm } = this.props;
    dispatch({
      type: 'po/toggleForm',
      payload: !expandForm,
    });
  };

  handleFormReset = () => {
    const { form, tabValue } = this.props;
    const searchParams = {
      [PONo.key]: undefined,
      [PORaiseDate.key]: undefined,
      [Buyer.key]: undefined,
      [Status.key]: TabText[tabValue].status,
      [Overdue.key]: undefined,
    };
    // resetFields会清空组件value并重新获取initialValue
    form.resetFields();
    this.props.handleSearch(searchParams);
  };

  handleSearch = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const searchParams = getFieldsValue();
    const { poRaiseDate = [] } = searchParams;
    this.props.handleSearch(
      Object.assign({}, searchParams, {
        gmtCreateBegin:
          poRaiseDate &&
          poRaiseDate[0] &&
          moment(poRaiseDate[0])
            .startOf('day')
            .toISOString(),
        gmtCreateEnd:
          poRaiseDate &&
          poRaiseDate[1] &&
          moment(poRaiseDate[1])
            .endOf('day')
            .toISOString(),
        poRaiseDate: undefined,
      }),
    );
  };

  render() {
    const { expandForm } = this.props;
    const { statusEnums = [] } = this.state;
    const {
      form: { getFieldDecorator },
      tabValue,
      searchParams,
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
            <FormItem label={formatMessage({ id: PONo.label })}>
              {getFieldDecorator(PONo.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: PORaiseDate.label })}>
              {getFieldDecorator(PORaiseDate.key)(
                <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ whiteSpace: 'nowrap' }}>
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
            <FormItem label={formatMessage({ id: PONo.label })}>
              {getFieldDecorator(PONo.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: PORaiseDate.label })}>
              {getFieldDecorator(PORaiseDate.key)(
                <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: Buyer.label })}>
              {getFieldDecorator(Buyer.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem key={tabValue} label={formatMessage({ id: Status.label })}>
              {getFieldDecorator(Status.key, {
                initialValue: searchParams[Status.key],
              })(
                <Select
                  disabled={
                    tabValue === TabValue.WaitingForOrder ||
                    tabValue === TabValue.WaitingForDelivery
                  }
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                >
                  {statusEnums.map(({ value, valueText }) => (
                    <Option value={value} key={value}>
                      {valueText}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: Overdue.label })}>
              {getFieldDecorator(Overdue.key, {
                initialValue: searchParams[Overdue.key],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                >
                  <Option value={1}>{formatMessage({ id: 'yeeorder.Yes' })}</Option>
                  <Option value={0}>{formatMessage({ id: 'yeeorder.No' })}</Option>
                </Select>,
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

export default Form.create()(POSearchForm);
