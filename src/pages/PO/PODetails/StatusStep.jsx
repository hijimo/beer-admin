import React, { PureComponent } from 'react';
import { Steps, Descriptions, Tooltip, Popover } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import DateIn18 from '@common/components/DateIn18';
import _get from 'lodash/get';
import QCResultCom from './QCResultCom';
import PaymentStatus from './PaymentStatus';
import { OrderStatus, Detailkeys, QcStatus } from '../enum';
import styles from '../style.less';

const { Step } = Steps;
const DescriptionsItem = Descriptions.Item;

class StatusStep extends PureComponent {
  render() {
    const { poDetail } = this.props;
    const orderProgressDTOList = _get(this.props.poDetail, 'orderProgressDTOList', []);
    const qcDetailDTOList = _get(this.props.poDetail, 'qcDetailDTOList', []);
    const inquirySupplierId = _get(this.props.poDetail, 'offerDetailDTO.inquirySupplierId');
    const needQc = _get(this.props.poDetail, 'orderQcDetailDTO.needQc');
    const { status } = poDetail;
    const current = orderProgressDTOList.reduce(
      (index, item, currentIndex) => (item.currentFlag ? currentIndex : index),
      -1,
    );
    const failed =
      status === OrderStatus.Cancel ||
      status === OrderStatus.Rejected ||
      (status === OrderStatus.InQC && poDetail.qcResult === QcStatus.Fail);
    let stepStatus = 'process';
    if (failed) {
      stepStatus = 'error';
    } else if (status === OrderStatus.Canceled) {
      stepStatus = 'finish';
    } else {
      stepStatus = 'process';
    }
    const {
      PONo,
      PORaiseDate,
      Status,
      Reason,
      PayStatus,
      RFQNo,
      QCResult,
      QCReport,
      OverdueFlag,
    } = Detailkeys;
    return (
      <div>
        <Steps
          status={stepStatus}
          current={current}
          labelPlacement='vertical'
          className={status === OrderStatus.Cancel ? styles.canceled : ''}
        >
          {orderProgressDTOList.map((item, index) => {
            const { statusText, gmtDate } = item;
            return (
              <Step
                className={styles.cancel}
                key={index}
                title={statusText}
                description={gmtDate && <DateIn18 date={gmtDate} fullTime />}
              />
            );
          })}
        </Steps>
        <Descriptions column={4} style={{ marginTop: 16 }}>
          <DescriptionsItem label={formatMessage({ id: PONo.label })}>
            {poDetail[PONo.key] || '--'}
          </DescriptionsItem>
          <DescriptionsItem label={formatMessage({ id: PORaiseDate.label })}>
            {poDetail[PORaiseDate.key] ? (
              <DateIn18 date={poDetail[PORaiseDate.key]} fullTime />
            ) : (
              '--'
            )}
          </DescriptionsItem>
          <DescriptionsItem label={formatMessage({ id: Status.label })}>
            {poDetail[`${Status.key}Text`] || '--'}
            {!!poDetail[OverdueFlag.key] && ( // 如果订单已逾期
              <span style={{ marginLeft: 16, color: 'red' }}>
                ({formatMessage({ id: 'po.list.overdue' })})
              </span>
            )}
            {poDetail[Status.key] === OrderStatus.Rejected && ( // 如果订单被拒绝，浮窗显示原因
              <Tooltip placement='bottomRight' title={poDetail[Reason.key] || '--'}>
                <a style={{ marginLeft: 16 }}>{formatMessage({ id: Reason.label })}</a>
              </Tooltip>
            )}
          </DescriptionsItem>
          <DescriptionsItem label={formatMessage({ id: PayStatus.label })}>
            {poDetail[`${PayStatus.key}Text`] || '--'}
          </DescriptionsItem>
          {!!poDetail[RFQNo.key] && ( // 如果和rfq关联，则显示rfqNo,且能链接到rfq详情，rfq已经报过价
            <DescriptionsItem label={formatMessage({ id: RFQNo.label })} span={4}>
              <Link to={`/rfq/${inquirySupplierId}/detail?qutoesStatus=1`}>
                {poDetail[RFQNo.key]}
              </Link>
            </DescriptionsItem>
          )}
          {needQc === 1 && (
            <DescriptionsItem label={formatMessage({ id: QCResult.label })}>
              {poDetail[`${QCResult.key}Text`] || '--'}&nbsp;&nbsp;
              <Popover
                style={{ width: '60%' }}
                trigger='click'
                placement='bottomLeft'
                content={<QCResultCom qcReport={qcDetailDTOList} />}
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      alignItems: 'center',
                    }}
                  >
                    {formatMessage({ id: QCReport.label })}
                  </div>
                }
              >
                <a style={{ marginLeft: 16 }}>{formatMessage({ id: 'yeeorder.Details' })}</a>
              </Popover>
            </DescriptionsItem>
          )}
        </Descriptions>
        {![OrderStatus.Unconfirmed, OrderStatus.Rejected, OrderStatus.Cancel].includes(status) && (
          <PaymentStatus poDetail={poDetail} />
        )}
      </div>
    );
  }
}

export default StatusStep;
