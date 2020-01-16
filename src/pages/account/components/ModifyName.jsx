import { Form, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { lenErrMessage, specialCharValidator } from '@/utils/utils';

const FormItem = Form.Item;
const formFiredsKeys = {
  firstName: 'firstName',
  lastName: 'lastName',
};

@connect(({ user }) => ({
  userInfo: user.currentUser,
}))
class ModifyName extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const rules = {
      firstname: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.first-name-message' }),
        },
        {
          max: 500,
          message: lenErrMessage({ max: 500 }),
        },
        {
          validator: specialCharValidator,
        },
      ],
      lastName: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.last-name-message' }),
        },
        {
          max: 500,
          message: lenErrMessage({ max: 500 }),
        },
        {
          validator: specialCharValidator,
        },
      ],
    };

    return (
      <Fragment>
        <FormItem label={formatMessage({ id: 'app.account.first-name' })}>
          {getFieldDecorator(formFiredsKeys.firstName, {
            // initialValue: firstName,
            rules: rules.firstname,
            validateFirst: true,
          })(
            <Input
              autoComplete='off'
              placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            />,
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'app.account.last-name' })}>
          {getFieldDecorator(formFiredsKeys.lastName, {
            // initialValue: lastName,
            rules: rules.lastName,
            validateFirst: true,
          })(
            <Input
              placeholder={formatMessage({ id: 'yeeorder.please-input' })}
              autoComplete='off'
            />,
          )}
        </FormItem>
      </Fragment>
    );
  }
}

export default Form.create()(ModifyName);
