import { Modal, Form, Input } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { lenErrMessage } from '@/utils/utils';

const FormItem = Form.Item;
const maxCharacters = 500;

class ReApplyModal extends Component {
  componentDidUpdate() {
    if (!this.props.visible) {
      const {
        form: { resetFields },
      } = this.props;
      resetFields();
    }
  }

  handleSubmit = () => {
    const { form, detail } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        this.props.handleSubmit({
          ...values,
          id: detail.id,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      detail,
      visible,
      handleModalClose,
    } = this.props;
    return (
      <Modal
        visible={visible}
        width={500}
        title={formatMessage({ id: 'yeeorder.Apply' })}
        onOk={this.handleSubmit}
        onCancel={handleModalClose}
        okText='Confirm'
      >
        <Form>
          {/* <p style={{ fontSize: 16, color: '#000', fontWeight: 500 }}>
            {_get(detail, 'auCompanyName')}
          </p> */}
          <FormItem label={formatMessage({ id: 'my-expo.re-apply.contact-name' })}>
            {getFieldDecorator('auContacts', {
              initialValue: detail.contacts,
              rules: [
                {
                  max: maxCharacters,
                  message: lenErrMessage({ max: maxCharacters }),
                },
                {
                  required: true,
                  message: `${formatMessage({ id: 'my-expo.re-apply.contact-name.required' })}`,
                },
              ],
            })(
              <Input
                autoComplete='off'
                placeholder={formatMessage({ id: 'yeeorder.please-input' })}
              />,
            )}
          </FormItem>
          <FormItem label={formatMessage({ id: 'my-expo.re-apply.telephone' })}>
            {getFieldDecorator('auContactWay', {
              initialValue: detail.contactWay,
              rules: [
                {
                  required: true,
                  message: `${formatMessage({ id: 'my-expo.re-apply.telephone.required' })}`,
                },
              ],
            })(
              <Input
                autoComplete='off'
                placeholder={formatMessage({ id: 'yeeorder.please-input' })}
              />,
            )}
          </FormItem>
          <FormItem label={formatMessage({ id: 'my-expo.re-apply.email' })}>
            {getFieldDecorator('auEmail', {
              rules: [
                {
                  type: 'email',
                  message: `${formatMessage({ id: 'my-expo.re-apply.email.format-error' })}`,
                },
                {
                  required: true,
                  message: `${formatMessage({ id: 'my-expo.re-apply.email.required' })}`,
                },
              ],
            })(
              <Input
                autoComplete='off'
                placeholder={formatMessage({ id: 'yeeorder.please-input' })}
              />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ReApplyModal);
