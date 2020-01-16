import React, { useState } from 'react';
import { Button, Form, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import TextArea from '@common/components/TextArea/TextArea';
import { sendMessage } from '../../service';
import styles from '../index.less';

const MessageInput = ({
  total,
  reloadMessage,
  contactId,
  form: { getFieldDecorator, validateFields, resetFields },
}) => {
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    setLoading(true);
    validateFields((err, values) => {
      if (err) {
        message.warning('please enter content');
        setLoading(false);
      } else {
        sendMessage({
          ...values,
          contactId,
        }).then(({ success }) => {
          setLoading(false);
          if (success) {
            resetFields();
            reloadMessage();
            message.success(formatMessage({ id: 'yeeorder.success' }));
          }
        });
      }
    });
  };

  return (
    <>
      <Form>
        <Form.Item className={styles['form-item']}>
          <span className={styles.messageInput}>
            <span className={styles.inputWrapper}>
              {getFieldDecorator('contactInfo', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'inquiry.contact-info.required' }),
                  },
                ],
              })(
                <TextArea
                  placeholder={formatMessage({ id: 'inquiry.contact-info.placeholder' })}
                  maxLength={1000}
                />,
              )}
              <span className={styles.btnWrapper}>
                {loading ? (
                  <Button type='primary' loading />
                ) : (
                  <Button type='primary' onClick={handleSend}>
                    SEND
                  </Button>
                )}
              </span>
            </span>
          </span>
        </Form.Item>
      </Form>
      <span className={styles.messageNum}>
        {`${formatMessage({ id: 'yeeorder.total' })} ${total || 0} ${formatMessage({
          id: 'yeeorder.messages',
        })}`}
      </span>
    </>
  );
};

export default Form.create()(MessageInput);
