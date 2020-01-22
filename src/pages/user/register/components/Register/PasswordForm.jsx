import { Form, Input, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React from 'react';

import pattern from '@common/pattern/index';
import styles from './PasswordForm.less';

const { regPassword } = pattern;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const FormItem = Form.Item;

const PasswordForm = props => {
  const { eMail: email } = props;

  const { getFieldDecorator, getFieldValue, validateFields } = props.form;

  const pwdSome = (rule, value) => {
    const field = rule.field === 'password' ? 'password1' : 'password';

    const [pwd] = [getFieldValue(field)];
    if (!pwd || !value) return true;
    return pwd === value;
  };
  const handlepwdChange = () => {
    const [pwd, pwd1] = [getFieldValue('password'), getFieldValue('password1')];
    // 同步验证一致性
    if (pwd && pwd1) {
      setTimeout(() => {
        validateFields(['password', 'password1']);
      }, 100);
    }
  };
  const rules = {
    password: [
      {
        required: true,
        type: 'string',
        message: formatMessage({ id: 'page.register.error.password.required' }),
      },
      // 8-16 char len
      {
        type: 'string',
        message: formatMessage({ id: 'page.register.error.password.range' }),
        min: 8,
        max: 16,
      },
      // number + str
      {
        type: 'string',
        pattern: regPassword,
        message: formatMessage({ id: 'page.register.error.password.format' }),
      },
      // can't some account
      {
        type: 'string',
        validator: (rule, value) => value.includes(email) === false,
        message: formatMessage({ id: 'page.register.error.password.someAccount' }),
      },
    ],
    password1: [
      {
        required: true,
        type: 'string',
        message: formatMessage({ id: 'page.register.error.password.required' }),
      },
      // 两次密码输入不一致
      {
        type: 'string',
        validator: pwdSome,
        message: formatMessage({ id: 'page.register.error.password.some' }),
      },
    ],
  };

  return (
    <>
      <Form {...formItemLayout} className={styles.passwordForm}>
        <Tooltip
          placement='right'
          overlayClassName={styles.tooltipCls}
          title={() => (
            <>
              <div>
                <FormattedMessage id='page.register.text.pwdTip1' />
              </div>
              <div>
                <FormattedMessage id='page.register.text.pwdTip2' />
              </div>
              <div>
                <FormattedMessage id='page.register.text.pwdTip3' />
              </div>
            </>
          )}
        >
          {/* 这里需要一个空的div作为tooltip的容器，不然无法显示 */}
          <div>
            <FormItem label={formatMessage({ id: 'page.register.label.password' })}>
              {getFieldDecorator('password', { validateFirst: true, rules: rules.password })(
                <Input
                  placeholder={formatMessage({ id: 'page.register.placeholder.password' })}
                  maxLength={16}
                  onChange={handlepwdChange}
                  type='password'
                />,
              )}
            </FormItem>
          </div>
        </Tooltip>
        <FormItem label={formatMessage({ id: 'page.register.label.confirmPassword' })}>
          {getFieldDecorator('password1', {
            validateFirst: true,
            rules: rules.password1,
          })(
            <Input
              placeholder={formatMessage({ id: 'page.register.placeholder.password1' })}
              onChange={handlepwdChange}
              maxLength={16}
              type='password'
            />,
          )}
        </FormItem>
      </Form>
    </>
  );
};
export default PasswordForm;
// export default Form.create()(PasswordForm);
