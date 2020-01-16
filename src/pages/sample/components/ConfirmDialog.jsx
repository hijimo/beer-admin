import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import { FormKeys } from '../enum';

class ConfirmDialog extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { ProformaInvoice } = FormKeys;
    return (
      <>
        <p style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
          {formatMessage({ id: 'sample.management.confirm-text' })}
        </p>
        <Form.Item label={formatMessage({ id: ProformaInvoice.label })}>
          {getFieldDecorator('attachmentList')(
            <UploadList
              accpet='.pdf, .jpg, .jpeg, .png'
              maxSize={5 * 1024}
              maxLength={10}
              listType='picture-card'
            />,
          )}
          <p className='uploadTips'>
            {formatMessage({ id: 'sample.management.proforma-invoice.tips' })}
          </p>
        </Form.Item>
      </>
    );
  }
}

export default Form.create()(ConfirmDialog);
