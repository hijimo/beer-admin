import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import TextArea from '@common/components/TextArea/TextArea';
import { RejectKeys } from '../enum';

class RejectContent extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { Reason } = RejectKeys;
    return (
      <Form.Item label={formatMessage({ id: Reason.label })}>
        {getFieldDecorator(Reason.key, {
          rules: [
            {
              required: true,
              message: formatMessage({ id: Reason.required }),
            },
          ],
        })(
          <TextArea
            maxLength={500}
            placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />,
        )}
      </Form.Item>
    );
  }
}

export default Form.create()(RejectContent);
