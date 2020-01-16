import React, { PureComponent } from 'react';
import { Descriptions } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import DateIn18 from '@common/components/DateIn18';
import _get from 'lodash/get';
import { PaymentKeys, PaymentType, PaymentConfirmStatus } from '../enum';
import styles from '../style.less';

const DescriptionsItem = Descriptions.Item;
const { TotalAmount, InitialProof } = PaymentKeys;

class PaymentContent extends PureComponent {
  render() {
    const totalAmountText = _get(this.props.paymentInfo, 'totalAmountText', '');
    const paymentOrderList = _get(this.props.paymentInfo, 'paymentOrderList', []) || [];
    const firstPaymentDone =
      paymentOrderList[0] && paymentOrderList[0].status === PaymentConfirmStatus.Confirmed;
    return (
      <>
        <Descriptions>
          <DescriptionsItem label={formatMessage({ id: TotalAmount.label })}>
            <span className={styles.moneyText}>{totalAmountText || '--'}</span>
          </DescriptionsItem>
        </Descriptions>
        {paymentOrderList.map((item, index) => {
          const {
            payTypeText,
            percentageTypeText,
            amountText,
            proofList,
            finalTermText,
            payType,
            gmtCreate,
          } = item;
          // const show = index === 0 || (index === 1 && firstPaymentDone);
          let firstDescription = '';
          let secondDescription = '';
          if (index === 0) {
            if (payType === PaymentType.full) {
              // 全款支付显示金额
              firstDescription = amountText || '--';
              secondDescription = '';
            } else {
              // 首次支付显示百分比和金额
              firstDescription = percentageTypeText || '--';
              secondDescription = amountText || '--';
            }
          } else {
            // 二次支付显示金额和账期
            firstDescription = amountText || '--';
            secondDescription = finalTermText;
          }
          return (
            <div key={index}>
              <Descriptions column={2}>
                <DescriptionsItem label={payTypeText}>
                  {firstDescription}
                  <span style={{ marginLeft: 16 }} className={index === 0 ? styles.moneyText : ''}>
                    {secondDescription}
                  </span>
                </DescriptionsItem>
                <DescriptionsItem label={`${formatMessage({ id: 'po.pay-status.payment-date' })}`}>
                  {gmtCreate ? <DateIn18 date={gmtCreate} /> : '--'}
                </DescriptionsItem>
              </Descriptions>
              {// 付首款确认时显示第二次的金额和账期，不显示支付凭证
              (firstPaymentDone || index === 0) && (
                <Descriptions>
                  <DescriptionsItem
                    className={proofList && !!proofList.length ? styles.imgRow : ''}
                    label={formatMessage({ id: InitialProof.label })}
                  >
                    {proofList && !!proofList.length ? (
                      <UploadList
                        disabled
                        value={proofList || []}
                        listType='picture-card'
                        maxLength={0}
                      />
                    ) : (
                      '--'
                    )}
                  </DescriptionsItem>
                </Descriptions>
              )}
            </div>
          );
        })}
      </>
    );
  }
}

export default PaymentContent;
