import React, { PureComponent } from 'react';
import { Descriptions } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import { FormKeys } from '../enum';
import styles from '../style.less';

class PaymentDialog extends PureComponent {
  render() {
    const { detail } = this.props;
    const { TotalAmount, PaymentProof } = FormKeys;
    const { paymentProofList } = detail;
    return (
      <>
        <Descriptions>
          <Descriptions.Item span={3} label={formatMessage({ id: TotalAmount.label })}>
            {detail[`${TotalAmount.key}Text`] ? (
              <strong style={{ marginRight: 16, fontSize: '120%', color: 'rgba(0, 0, 0, 0.85)' }}>
                {detail[`${TotalAmount.key}Text`]}
              </strong>
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item
            className={paymentProofList && !!paymentProofList.length ? styles.imgRow : ''}
            label={formatMessage({ id: PaymentProof.label })}
          >
            {paymentProofList && !!paymentProofList.length ? (
              <UploadList disabled value={paymentProofList} listType='picture-card' maxLength={0} />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
      </>
    );
  }
}

export default PaymentDialog;
