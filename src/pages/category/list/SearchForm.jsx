import React from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const { Item: FormItem } = Form;

const SearchForm = props => {
  const {
    onSearch,
    form: { getFieldDecorator, resetFields, getFieldsValue },
  } = props;

  const handleReset = () => {
    resetFields();
    onSearch(getFieldsValue());
  };

  const handleSearch = () => onSearch(getFieldsValue());

  return (
    <Form layout='inline' className='tableListForm'>
      <Row gutter={{ md: 8, lg: 24, xl: 24 }}>
        <Col md={8} sm={24}>
          <FormItem label='门店名称'>
            {getFieldDecorator('name')(
              <Input
                allowClear
                placeholder='请输入门店名称'
                autoComplete='off'
              />,
            )}
          </FormItem>
        </Col>
      </Row>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ float: 'right', marginBottom: 24 }}>
          <Button type='primary' onClick={handleSearch}>
            {formatMessage({ id: 'yeeorder.search' })}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
            {formatMessage({ id: 'yeeorder.reset' })}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default Form.create()(SearchForm);
