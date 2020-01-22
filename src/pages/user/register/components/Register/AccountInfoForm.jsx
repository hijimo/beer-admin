import { Form, Input, Row, Col, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { useState, useEffect } from 'react';
import pattern from '@common/pattern/index';
import { postSendPhoneCode } from '@/services/common';
import styles from './AccountInfoForm.less';
import useCountDown from '@/hooks/useCountDown';

const FormItem = Form.Item;
const sendInterval = 60;
const { regPhone } = pattern;
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

const AccountInfoForm = props => {
  const { companyType } = props;
  const { getFieldDecorator, getFieldValue, getFieldError } = props.form;

  const rules = {
    companyName: [
      {
        required: true,
        type: 'string',

        message: formatMessage({ id: 'page.register.error.company.required' }),
      },
      {
        type: 'string',
        min: 4,
        max: 180,
        message: formatMessage({ id: 'page.register.error.company.range' }),
      },
    ],
    firstName: [
      {
        required: true,
        type: 'string',
        message: formatMessage({ id: 'page.register.error.firstName.required' }),
      },
    ],
    lastName: [
      {
        required: true,
        type: 'string',
        message: formatMessage({ id: 'page.register.error.lastName.required' }),
      },
    ],
    phone: [
      {
        required: true,
        type: 'string',
        message: formatMessage({ id: 'page.register.error.phone.required' }),
      },
      {
        type: 'string',
        pattern: regPhone,
        message: formatMessage({ id: 'page.register.error.phone.format' }),
      },
      // 这里还有一个输入phone需要验证，写到button里了
    ],
    code: [
      {
        required: true,
        type: 'string',
        message: formatMessage({ id: 'page.register.error.code.required' }),
      },
    ],
  };

  const [delay, setDelay] = useState(0);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [cleanup, reset] = useCountDown(0, c => {
    setDelay(c);
  });
  useEffect(
    () => () => {
      cleanup();
    },
    [],
  );

  const resetCodeBtn = () => {
    setSendCodeLoading(false);
    cleanup();
  };
  const handleSendCode = e => {
    e.preventDefault();
    const mobile = getFieldValue('mobile');
    if (!mobile) return;
    setSendCodeLoading(true);
    postSendPhoneCode({ mobile, verifyCodeType: 0 }).then(res => {
      if (!res.success) {
        resetCodeBtn();
      } else {
        setSendCodeLoading(false);
      }
    });

    reset(sendInterval);
    // 触发ui更新
    setDelay(sendInterval);
  };

  const isBuyer = companyType === '1';

  return (
    <>
      <Form {...formItemLayout} className={styles.accountInfoForm}>
        <FormItem label={formatMessage({ id: 'page.register.label.companyName' })}>
          {getFieldDecorator('companyName', { validateFirst: true, rules: rules.companyName })(
            <Input
              placeholder={formatMessage({ id: 'page.register.placeholder.company' })}
              maxLength={180}
            />,
          )}
        </FormItem>
        <Row gutter={14} className={styles.firstNameRow}>
          <Col span={16}>
            <FormItem label={formatMessage({ id: 'page.register.label.name' })}>
              {getFieldDecorator('firstName', {
                validateFirst: true,
                rules: rules.firstName,
              })(
                <Input
                  placeholder={formatMessage({ id: 'page.register.placeholder.firstName' })}
                  maxLength={32}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('lastName', {
                validateFirst: true,
                rules: rules.lastName,
              })(
                <Input
                  placeholder={formatMessage({ id: 'page.register.placeholder.lastName' })}
                  maxLength={32}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        {isBuyer ? null : (
          <>
            <FormItem label={formatMessage({ id: 'page.register.label.phone' })}>
              {getFieldDecorator('mobile', {
                validateFirst: true,
                rules: rules.phone,
              })(
                <Input
                  placeholder={formatMessage({ id: 'page.register.placeholder.phone' })}
                  maxLength={20}
                />,
              )}
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'page.register.label.code' })}
              className={styles.sendCodeRow}
            >
              <Row>
                <Col span={16}>
                  {getFieldDecorator('mobileVerifyCode', {
                    validateFirst: true,
                    rules: rules.code,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'page.register.placeholder.code' })}
                      maxLength={6}
                    />,
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    type='primary'
                    onClick={handleSendCode}
                    loading={sendCodeLoading}
                    disabled={delay > 0 || getFieldError('mobile') || !getFieldValue('mobile')}
                  >
                    {delay ? `${delay}s` : formatMessage({ id: 'page.register.button.code' })}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </>
        )}
      </Form>
    </>
  );
};
export default AccountInfoForm;
// export default Form.create()(AccountInfoForm);
