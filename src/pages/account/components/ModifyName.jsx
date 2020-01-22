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
          message: '用户昵称不能为空',
        },
      ],
      
    };

    return (
      <Fragment>
        <FormItem label='用户昵称'>
          {getFieldDecorator('realName', {
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
       
      </Fragment>
    );
  }
}

export default Form.create()(ModifyName);
