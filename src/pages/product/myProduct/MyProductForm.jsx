import { Form, Row, Col, Input, Button } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const FormItem = Form.Item;
const FORM_KEYS = {
  PRODUCT_NO: 'spuNo',
  PRODUCT_NAME: 'name',
  EXPO_STATUS: 'compStatus',
};
const RowGutter = {
  md: 8,
  lg: 24,
  xl: 24,
};

class MyProductForm extends Component {
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.handleSearch({});
  };

  handleSearch = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    this.props.handleSearch(getFieldsValue());
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const renderSimpleForm = () => (
      <Form layout='inline'>
        <Row gutter={RowGutter}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'my-product.form.product-no' })}>
              {getFieldDecorator(FORM_KEYS.PRODUCT_NO)(
                <Input
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'my-product.form.product-name' })}>
              {getFieldDecorator(FORM_KEYS.PRODUCT_NAME)(
                <Input
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
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
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
    return <div className='tableListForm'>{renderSimpleForm()}</div>;
  }
}

export default Form.create()(MyProductForm);
