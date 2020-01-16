import React, { Component } from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import '../style.less';

const FormItem = Form.Item;

class CategoryForm extends Component {
  handleReset = () => {
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
    const rowGutter = {
      md: 8,
      lg: 24,
      xl: 24,
    };
    return (
      <div className='tableListForm'>
        <Form layout='inline'>
          <Row gutter={rowGutter}>
            <Col md={8} sm={24}>
              <FormItem label={formatMessage({ id: 'category.form.group-name' })}>
                {getFieldDecorator('name')(
                  <Input
                    autoComplete='off'
                    placeholder={formatMessage({ id: 'category.form.group-name' })}
                  />,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem>
                <Button type='primary' style={{ marginRight: 20 }} onClick={this.handleSearch}>
                  {formatMessage({ id: 'yeeorder.search' })}
                </Button>
                <Button onClick={this.handleReset}>
                  {formatMessage({ id: 'yeeorder.reset' })}
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(CategoryForm);
