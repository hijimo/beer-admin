import React, { Component } from 'react';
import { Form } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import { ConfirmKeys } from '../enum';

class ConfirmContent extends Component {
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { ProformaInvoice } = ConfirmKeys;
    return (
      <>
        <p style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
          {formatMessage({ id: 'po.confirm.confirm-text' })}
        </p>
        <Form.Item label={formatMessage({ id: ProformaInvoice.label })}>
          {getFieldDecorator(ProformaInvoice.key, {
            getValueFromEvent: this.normFile,
          })(
            <UploadList
              accpet='.pdf, .jpg, .jpeg, .png'
              maxSize={5 * 1024}
              maxLength={10}
              listType='picture-card'
            />,
          )}
          <p className='uploadTips'>{formatMessage({ id: ProformaInvoice.tips })}</p>
        </Form.Item>
      </>
    );
  }
}

export default Form.create()(ConfirmContent);
