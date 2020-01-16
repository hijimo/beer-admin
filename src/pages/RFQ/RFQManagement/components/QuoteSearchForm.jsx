import { Form, Row, Col, Input, Button, Icon, DatePicker } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { QuoteKeys } from '../../enum';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Product, Buyer, RFQResealeDate, RFQNO } = QuoteKeys;

class QuoteSearchForm extends Component {
  state = {
    expandForm: false,
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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
    const { gmtCreate = [] } = searchParams;
    this.props.handleSearch(
      Object.assign({}, searchParams, {
        gmtCreateStart:
          gmtCreate[0] &&
          moment(gmtCreate[0])
            .startOf('day')
            .toISOString(),
        gmtCreateEnd:
          gmtCreate[1] &&
          moment(gmtCreate[1])
            .endOf('day')
            .toISOString(),
        gmtCreate: undefined,
      }),
    );
  };

  render() {
    const { expandForm } = this.state;
    const {
      form: { getFieldDecorator },
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
            <FormItem label={formatMessage({ id: Product.label })}>
              {getFieldDecorator(Product.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
            <FormItem label={formatMessage({ id: Product.label })}>
              {getFieldDecorator(Product.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
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
            <FormItem label={formatMessage({ id: RFQResealeDate.label })}>
              {getFieldDecorator(RFQResealeDate.key)(
                <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: RFQNO.label })}>
              {getFieldDecorator(RFQNO.key)(
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

export default Form.create()(QuoteSearchForm);
