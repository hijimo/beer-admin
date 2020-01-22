import { Button, Form, Input, Checkbox, Radio, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { useState } from 'react';
import ProtocolModal from '@common/components/ProtocolModal';
import { postEmailExist } from '@/services/user';
import styles from './EmailForm.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const EmailForm = props => {
  const [modalVisiable, setModalVisiable] = useState(false);
  /* type === 1 ? 注册 type === 2 ? 找回密码 */
  const { loading, form, type = 1 } = props;
  const { getFieldDecorator, getFieldError, getFieldValue } = form;

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
  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFields((error, values) => {
      if (!error) {
        const { email } = values;
        const { onSuccess } = props;
        if (type === 1) {
          postEmailExist({ email }).then(res => {
            const { success, data } = res;
            if (success && !data) {
              if (onSuccess) {
                onSuccess(values);
              }
            } else if (data === true) {
              message.error(formatMessage({ id: 'page.register.error.eMail.exists' }));
            }
          });
        } else if (onSuccess) {
          onSuccess(values);
        }
      }
    });
  };
  const handleToggleModal = e => {
    e.preventDefault();
    setModalVisiable(true);
  };
  const rules = {
    email: [
      {
        required: true,
        message: formatMessage({ id: 'page.register.error.eMail.required' }),
      },
      {
        type: 'email',
        message: formatMessage({ id: 'page.register.error.eMail.format' }),
      },
      // 在inputChange事件里，还要对email做唯一性验证
    ],
  };
  const buttonDisabled =
    type === 1
      ? getFieldError('email') || !getFieldValue('iagree') || !getFieldValue('email')
      : getFieldError('email') || !getFieldValue('email');

  return (
    <>
      <Form {...formItemLayout} onSubmit={handleSubmit} className={styles.emailForm}>
        {type === 1 ? (
          <FormItem label={formatMessage({ id: 'page.register.label.iAm' })}>
            {getFieldDecorator('type', {
              initialValue: 1,
            })(
              <RadioGroup>
                <Radio value={1}>{formatMessage({ id: 'page.register.other.purchaser' })}</Radio>
                <Radio value={0}>{formatMessage({ id: 'page.register.other.supplier' })}</Radio>
              </RadioGroup>,
            )}
          </FormItem>
        ) : null}

        <FormItem label={formatMessage({ id: 'page.register.label.eMail' })}>
          {getFieldDecorator('email', {
            rules: rules.email,
          })(<Input placeholder={formatMessage({ id: 'page.register.placeholder.email' })} />)}
        </FormItem>
        {type === 1 ? (
          <FormItem label='' className={styles.agreeFormItem}>
            {getFieldDecorator('iagree', { valuePropName: 'checked', initialValue: false })(
              <Checkbox style={{ fontSize: '12px' }}>
                <FormattedMessage id='page.register.text.iAgree' style={{ whiteSpace: 'nowrap' }} />
                <a onClick={handleToggleModal} style={{ paddingLeft: '8px', whiteSpace: 'nowrap' }}>
                  <FormattedMessage id='page.register.link.yeeorderFree' />
                </a>
              </Checkbox>,
            )}
          </FormItem>
        ) : null}

        <FormItem style={{ marginBottom: 0 }}>
          <Button
            type='primary'
            loading={loading}
            htmlType='submit'
            className={styles.buttonSubmit}
            disabled={buttonDisabled}
          >
            <FormattedMessage id='page.register.button.next' />
          </Button>
        </FormItem>
      </Form>
      <ProtocolModal
        visible={modalVisiable}
        width={772}
        onCancel={() => {
          setModalVisiable(false);
        }}
      />
    </>
  );
};
export default Form.create()(EmailForm);
