import { Form, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { pswValidator } from '@/utils/utils';

const FormItem = Form.Item;
const formFiredsKeys = {
  oldPassword: 'oldPassword',
  newPassword: 'userPassword',
  confirmPassword: 'confirmPassword',
};

class ModifyPsw extends Component {
  newPasswordChange = () => {
    this.props.form.setFieldsValue({
      confirmPassword: '',
    });
  };

  pswCheck = (rule, value) => {
    const newPassword = this.props.form.getFieldValue(formFiredsKeys.newPassword);
    if (!value) return false;
    return value === newPassword;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const rules = {
      oldPassword: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.account-password-empty-message' }),
        },
        
      ],
      newPassword: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.new-password-empty-message' }),
        },
        
      ],
      confirmPassword: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.confirm-password-empty-message' }),
        },
        
        {
          validator: this.pswCheck,
          message: formatMessage({ id: 'app.account.password-is-different' }),
        },
      ],
    };

    return (
      <Fragment>
        <FormItem
          label={formatMessage({
            id: 'app.account.account-password',
          })}
        >
          {getFieldDecorator(formFiredsKeys.oldPassword, {
            rules: rules.oldPassword,
          })(<Input.Password placeholder={formatMessage({ id: 'yeeorder.please-input' })} />)}
        </FormItem>
        <FormItem
          label={formatMessage({
            id: 'app.account.new-password',
          })}
        >
          {getFieldDecorator(formFiredsKeys.newPassword, {
            rules: rules.newPassword,
          })(
            <Input.Password
              onChange={this.newPasswordChange}
              placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            />,
          )}
        </FormItem>
        <FormItem
          label={formatMessage({
            id: 'app.account.confirm-password',
          })}
        >
          {getFieldDecorator(formFiredsKeys.confirmPassword, {
            validateFirst: true,
            validate: [
              {
                trigger: ['onChange', 'onBlur'],
                rules: rules.confirmPassword,
              },
            ],
          })(<Input.Password placeholder={formatMessage({ id: 'yeeorder.please-input' })} />)}
        </FormItem>
      </Fragment>
    );
  }
}

export default Form.create()(ModifyPsw);
