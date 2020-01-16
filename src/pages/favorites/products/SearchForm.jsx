import { Form, Row, Col, Cascader, Input, Button } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';

const FormItem = Form.Item;
const FORM_KEYS = {
  ProductName: 'name',
  Category: 'category',
};
const RowGutter = {
  md: 8,
  lg: 24,
  xl: 24,
};

@connect(({ common }) => ({
  categoryTree: common.categoryTree || [],
}))
class ProductSearchForm extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'common/fetchCategory' });
  }

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
      categoryTree,
    } = this.props;
    const renderSimpleForm = () => (
      <Form layout='inline'>
        <Row gutter={RowGutter}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'favorites.products.product' })}>
              {getFieldDecorator(FORM_KEYS.ProductName)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'favorites.products.category' })}>
              {getFieldDecorator(FORM_KEYS.Category)(
                <Cascader
                  placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                  options={categoryTree}
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

export default Form.create()(ProductSearchForm);
