import React, { PureComponent } from 'react';
import { Form, Input, DatePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { regexpEng, regexpNum } from '@/utils/validate';
import { FormKeys } from '../enum';

class DeliverDialog extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { DeliveryDate, LogisticsProvider, LogisticsNo } = FormKeys;
    return (
      <>
        <Form.Item label={formatMessage({ id: DeliveryDate.label })}>
          {getFieldDecorator(DeliveryDate.key, {
            rules: [
              {
                required: true,
                message: formatMessage({ id: DeliveryDate.required }),
              },
            ],
          })(<DatePicker style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: LogisticsProvider.label })}>
          {getFieldDecorator(LogisticsProvider.key, {
            validateFirst: true,
            rules: [
              {
                required: true,
                message: formatMessage({ id: LogisticsProvider.required }),
              },
              {
                pattern: regexpEng,
                message: `${formatMessage({ id: 'yeeorder.regexp.eng.msg' })}`,
              },
            ],
          })(
            <Input
              autoComplete='off'
              placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            />,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: LogisticsNo.label })}>
          {getFieldDecorator(LogisticsNo.key, {
            validateFirst: true,
            rules: [
              {
                required: true,
                message: formatMessage({ id: LogisticsNo.required }),
              },
              {
                pattern: regexpNum,
                message: `${formatMessage({ id: 'yeeorder.regexp.num.msg' })}`,
              },
            ],
          })(
            <Input
              autoComplete='off'
              placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            />,
          )}
        </Form.Item>
      </>
    );
  }
}

export default Form.create()(DeliverDialog);
