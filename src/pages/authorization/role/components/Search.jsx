import React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchFormBtn from '@/pages/components/SearchFormBtn';

const FormItem = Form.Item;
const rowGutter = {
  md: 8,
  lg: 24,
  xl: 24,
};

const Search = props => {
  const submitData = (flag = false) => {
    if (flag) {
      props.form.resetFields();
    }
    const values = props.form.getFieldsValue();
    props.searchParamsChange(values);
  };

  const { getFieldDecorator } = props.form;
  return (
    <div className='tableListForm'>
      <Form layout='inline'>
        <Row gutter={rowGutter}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'page.role.table.label.roleName' })}>
              {getFieldDecorator('roleName', {
                initialValue: '',
              })(
                <Input
                  placeholder={formatMessage({ id: 'page.role.input.placeholder.roleName' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'page.role.table.label.roleNo' })}>
              {getFieldDecorator('roleNo', {
                initialValue: '',
              })(
                <Input placeholder={formatMessage({ id: 'page.role.input.placeholder.roleNo' })} />,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem>
              <SearchFormBtn submitData={submitData} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Form.create()(Search);
