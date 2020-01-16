import React, { PureComponent } from 'react';
import { Descriptions, Typography, Icon, Modal, Tooltip } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import _get from 'lodash/get';
import PaymentContent from '../components/PaymentContent';
import { Detailkeys, PayStatusValue, PayStatusMap, PaymentConfirmStatus } from '../enum';
import '../style.less';

class PaymentStatus extends PureComponent {
  state = {
    modalVisible: false,
  };

  showPaymentDetail = () => {
    this.setState({ modalVisible: true });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  formatPaymentInfo = data => {
    const totalAmountText = _get(data, 'totalAmountText', {});
    const paymentOrderList = _get(data, 'paymentOrderDTOList', []);
    return {
      totalAmountText,
      paymentOrderList,
    };
  };

  render() {
    const { modalVisible } = this.state;
    const { poDetail } = this.props;
    const { payStatus, totalAmountText } = poDetail;
    const paymentOrderDTOList = _get(this.props.poDetail, 'paymentOrderDTOList', []);
    const { Payment, TotalAmount } = Detailkeys;
    const paymentInfo = this.formatPaymentInfo(poDetail);
    return (
      <div className='paymentStatus'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title style={{ margin: 0, marginRight: 16 }} level={4}>
            {formatMessage({ id: Payment.label })}
          </Typography.Title>
          <p style={{ flex: 1, margin: 0, borderBottom: '1px dashed #e8e8e8' }}></p>
        </div>
        <Descriptions>
          <Descriptions.Item label={formatMessage({ id: TotalAmount.label })}>
            <strong style={{ marginRight: 16, fontSize: '150%', color: 'rgba(0, 0, 0, 0.85)' }}>
              {totalAmountText || '--'}
            </strong>
            {/* 未付款显示To be Paid */}
            {[PayStatusValue.None, PayStatusValue.TobePaid].includes(payStatus) ? (
              formatMessage({ id: PayStatusMap[PayStatusValue.TobePaid].text })
            ) : (
              <span style={{ marginLeft: 16 }}>
                <a onClick={this.showPaymentDetail}>{formatMessage({ id: 'yeeorder.Details' })}</a>
              </span>
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          {paymentOrderDTOList &&
            !!paymentOrderDTOList.length &&
            paymentOrderDTOList.map((item, index) => {
              const {
                amountText,
                detailPayStatus,
                detailPayStatusText,
                payTypeText,
                status,
              } = item;
              return (
                <Descriptions.Item label={payTypeText} key={index}>
                  {amountText || '--'}
                  {detailPayStatus === PayStatusValue.TobePaid && (
                    <span style={{ marginLeft: 16 }}>{detailPayStatusText || '--'}</span>
                  )}
                  {detailPayStatus !== PayStatusValue.TobePaid &&
                    (status === PaymentConfirmStatus.Confirmed ? (
                      <span style={{ marginLeft: 16, cursor: 'pointer' }}>
                        <Tooltip
                          placement='bottom'
                          title={formatMessage({ id: 'po.detail.tooltip-check' })}
                        >
                          <Icon type='check-circle' style={{ color: '#52c41a' }} />
                        </Tooltip>
                      </span>
                    ) : (
                      <span style={{ marginLeft: 16, cursor: 'pointer' }}>
                        <Tooltip
                          placement='bottom'
                          title={formatMessage({ id: 'po.detail.tooltip-clock' })}
                        >
                          <Icon type='clock-circle' />
                        </Tooltip>
                      </span>
                    ))}
                </Descriptions.Item>
              );
            })}
        </Descriptions>
        <Modal
          width='50%'
          title={formatMessage({ id: 'po.pay-status.payment-details' })}
          visible={modalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <PaymentContent paymentInfo={paymentInfo} />
        </Modal>
      </div>
    );
  }
}

export default PaymentStatus;
