import { Form, Row, Col, Input, Button } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { QuoteKeys } from './enum';
import styles from './style.less';

const FormItem = Form.Item;
const { ProductName } = QuoteKeys;
class ProductSearchForm extends Component {
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
        <Row gutter={12}>
          <Col md={12} sm={24}>
            <FormItem
              className={styles.productName}
              label={formatMessage({ id: ProductName.label })}
            >
              {getFieldDecorator(ProductName.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
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
