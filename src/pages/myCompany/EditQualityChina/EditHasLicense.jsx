import { Button, Card, Form, DatePicker, Modal } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import _get from 'lodash/get';
import UploadList from '@common/components/UploadList';
import { LicenseConf as FORM_KEYS } from '../config';

const FormItem = Form.Item;

@connect()
class EditHasLicense extends Component {
  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        this.submitConfirm(values);
      }
    });
  };

  submitConfirm = values => {
    const that = this;
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Submit' })}`,
      content: `${formatMessage({ id: 'profile.Submit-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        that.submit(values);
      },
    });
  };

  submit = values => {
    const { dispatch } = this.props;
    const { zjCertPhoto = [] } = values;
    const params = Object.assign({}, values, {
      zjCertPhoto: {
        attachments: this.getAttachments(zjCertPhoto),
      },
    });
    dispatch({
      type: 'myCompany/editQChinaWithLicense',
      payload: params,
    });
  };

  handleCancel = () => {
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      content: `${formatMessage({ id: 'profile.Cancel-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        router.push('/myCompany?tab=qualityChina');
      },
    });
  };

  getAttachments = arr => {
    const attachments = arr.map(item => {
      const { name, size, status, uid, url } = item;
      return { name, size, status, uid, url };
    });
    return attachments;
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const {
      qualityChina = {},
      form: { getFieldDecorator },
    } = this.props;
    const zjCertPhoto = _get(qualityChina, 'zjCertPhoto.attachments', []);
    const zjCertValid = _get(qualityChina, 'zjCertValid', null);
    const formItemLayout = {
      labelCol: {
        lg: { span: 24 },
        xl: { span: 9 },
        xxl: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 18 },
        xl: { span: 12 },
        xxl: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        lg: {
          span: 24,
          offset: 0,
        },
        xl: {
          span: 12,
          offset: 9,
        },
        xxl: {
          span: 10,
          offset: 8,
        },
      },
    };
    const { License, ValidTo } = FORM_KEYS;
    return (
      <Card bordered={false} style={{ marginBottom: 80 }}>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={formatMessage({ id: License.label })}>
            {getFieldDecorator(License.key, {
              initialValue: zjCertPhoto,
              getValueFromEvent: this.normFile,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: License.required,
                  }),
                },
              ],
            })(<UploadList accpet='.png, .jpg, .jpeg' maxLength={1} listType='picture-card' />)}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({ id: ValidTo.label })}>
            {getFieldDecorator(ValidTo.key, {
              initialValue: zjCertValid ? moment(zjCertValid) : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: ValidTo.required,
                  }),
                },
              ],
            })(
              <DatePicker
                style={{ width: '300px' }}
                placeholder={formatMessage({ id: 'yeeorder.please-select' })}
              />,
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button onClick={() => this.handleCancel()}>
              <FormattedMessage id='yeeorder.Cancel' />
            </Button>
            <Button type='primary' htmlType='submit' style={{ marginLeft: 8 }}>
              <FormattedMessage id='yeeorder.Submit' />
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(EditHasLicense);
