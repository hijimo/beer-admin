import React, { Component } from 'react';
import { Form, DatePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import { DeliverKeys } from '../enum';

class DeliverContent extends Component {
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
    const { BLDate, BLProof } = DeliverKeys;
    return (
      <>
        <Form.Item label={formatMessage({ id: BLDate.label })}>
          {getFieldDecorator(BLDate.key, {
            rules: [
              {
                required: true,
                message: formatMessage({ id: BLDate.required }),
              },
            ],
          })(<DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: BLProof.label })}>
          {getFieldDecorator(BLProof.key, {
            getValueFromEvent: this.normFile,
            rules: [
              {
                required: true,
                message: formatMessage({ id: BLProof.required }),
              },
            ],
          })(
            <UploadList
              accpet='.pdf, .jpg, .jpeg, .png'
              maxSize={5 * 1024}
              maxLength={10}
              listType='picture-card'
            />,
          )}
          <p className='uploadTips'>{formatMessage({ id: BLProof.tips })}</p>
        </Form.Item>
      </>
    );
  }
}

export default Form.create()(DeliverContent);
