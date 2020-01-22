import { Form, Input, Button, Icon, Modal, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import React from 'react';
import Link from 'umi/link';
import { setUserInfo } from '@/utils/ls';
import styles from './index.less';

const FormItem = Form.Item;

const showAccountFreeze = () => {
  Modal.error({
    title: formatMessage({ id: 'component.loginform.error.accountFreeze' }),
    okText: formatMessage({ id: 'component.loginform.button.ok' }),
  });
};
const LoginForm = props => {
  const { form, onSuccess, dispatch, loading } = props;
  const { getFieldDecorator } = form;
  const rules = {
    email: [
      {
        required: true,
        type: 'string',
        message: formatMessage({ id: 'component.loginform.error.eMailBlank' }),
      },
      {
        type: 'email',
        message: formatMessage({ id: 'component.loginform.error.eMailFormat' }),
      },
    ],
    password: [
      {
        required: true,
        type: 'string',
        message: formatMessage({ id: 'component.loginform.error.passwordBlank' }),
      },
    ],
  };

  const signIn = async values => {
    const { username, password } = values;
    const params = {
      username: username.trim(),
      password,
    };
    dispatch({
      type: 'user/login',
      payload: params,
    }).then(res => {
      const {  data } = res || {};
      if (data) {
        setUserInfo(data);
        message.success(formatMessage({ id: 'component.loginform.tip.loginSuccess' }));
        if (onSuccess) {
          onSuccess(values);
        }
      }
        
        // 3025  账号冻结  3036  角色冻结  3038  公司冻结
      
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((error, values) => {
      if (!error) {
        signIn(values);
      }
    });
  };
  return (
    <div className={styles.loginForm}>
      <h1 className={styles.loginFormTitle}>
        {formatMessage({ id: 'component.loginform.text.signIn' })}
      </h1>
      <Form>
        <FormItem>
          {getFieldDecorator('username', {
            validateFirst: true,
            // rules: rules.email,
            initialValue: '',
          })(
            <Input
              size='large'
              prefix={<Icon type='user' className={styles.prefixIcon} />}
              placeholder={formatMessage({ id: 'component.loginform.placeholder.email' })}
              maxLength={32}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            validateFirst: true,
            initialValue: '',
            rules: rules.password,
          })(
            <Input
              size='large'
              prefix={<Icon type='lock' className={styles.prefixIcon} />}
              placeholder={formatMessage({ id: 'component.loginform.placeholder.password' })}
              maxLength={32}
              type='password'
            />,
          )}
        </FormItem>
        <div className={styles.loginFormLinkBar} style={{display:'none'}}>
          <Link to='/register' className={styles.loginFormLink}>
            {formatMessage({ id: 'component.loginform.link.joinFree' })}
          </Link>
          <Link to='/forget' className={styles.loginFormLink}>
            {formatMessage({ id: 'component.loginform.link.forgetPassword' })}
          </Link>
        </div>
        <Button
          htmlType='submit'
          onClick={handleSubmit}
          type='primary'
          className={styles.loginFormSubmit}
          size='large'
          loading={loading}
        >
          {formatMessage({ id: 'component.loginform.button.signIn' })}
        </Button>
      </Form>
    </div>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['user/login'],
}))(Form.create()(LoginForm));
// export default Form.create()(LoginForm);
