import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import TextArea from '@common/components/TextArea/TextArea';
import { FormKeys } from '../enum';

class RejectDialog extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { RejectReason } = FormKeys;
    return (
      <Form.Item label={formatMessage({ id: RejectReason.label })}>
        {getFieldDecorator(RejectReason.key, {
          rules: [
            {
              required: true,
              message: formatMessage({ id: RejectReason.required }),
            },
          ],
        })(
          <TextArea
            placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            autosize={{ minRows: 3, maxRows: 5 }}
            maxLength={500}
          />,
        )}
      </Form.Item>
    );
  }
}

export default Form.create()(RejectDialog);
