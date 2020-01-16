import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Input, Row, Col } from 'antd';
import SearchFormBtn from '@/pages/components/SearchFormBtn';

const FormItem = Form.Item;
const rowGutter = {
  md: 8,
  lg: 24,
  xl: 24,
};

const UserSearch = props => {
  const submitData = (flag = false) => {
    if (flag) {
      props.form.resetFields();
    }
    const values = props.form.getFieldsValue();
    props.searchParamsChange(values);
  };

  const renderAdvancedForm = () => {
    const { getFieldDecorator } = props.form;
    return (
      <Form layout='inline'>
        <Row gutter={rowGutter}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'page.user.table.label.userEmail' })}>
              {getFieldDecorator('email', {
                initialValue: '',
              })(
                <Input
                  placeholder={formatMessage({ id: 'page.user.input.placeholder.userEmail' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'page.user.table.label.userMobile' })}>
              {getFieldDecorator('mobile', {
                initialValue: '',
              })(
                <Input
                  placeholder={formatMessage({ id: 'page.user.input.placeholder.userMobile' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'page.user.table.label.userNo' })}>
              {getFieldDecorator('userNo', {
                initialValue: '',
              })(
                <Input placeholder={formatMessage({ id: 'page.user.input.placeholder.userNo' })} />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={rowGutter}>
          <Col offset={16} md={8} sm={24}>
            <div className='searchBtn'>
              <SearchFormBtn submitData={submitData} />
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  return <div className='tableListForm'>{renderAdvancedForm()}</div>;
};

export default Form.create()(UserSearch);
