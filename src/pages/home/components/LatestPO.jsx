import { Badge, Card, Skeleton, Typography, Modal, Form, message, Empty, Tooltip } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { router } from 'umi';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import GeneralTable from '@common/components/GeneralTable';
import DateIn18 from '@common/components/DateIn18';
import ActionList from '@common/components/ActionList';
import DeliverContent from '@/pages/PO/components/DeliverContent';
import PaymentContent from '@/pages/PO/components/PaymentContent';
import ConfirmContent from '@/pages/PO/components/ConfirmContent';
import RejectContent from '@/pages/PO/components/RejectContent';
import { formatPaymentInfo } from '@/pages/PO/util';
import {
  deliver,
  fetchPaymentInfo,
  paymentConfirm,
  confirmOrder,
  rejectOrder,
} from '@/services/po';
import {
  ListKeys,
  OrderStatus,
  OrderStatusMap,
  PayStatusValue,
  PayStatusMap,
  QcStatus,
  ModalType,
  ModalTypeMap,
} from '@/pages/PO/enum';
import styles from '../style.less';

const { Paragraph } = Typography;
const { PONo, PoRaiseDate, LastUpdate, Buyer, IncoTerms, Amount, Status, PayStatus } = ListKeys;

class LatestPO extends Component {
  state = {
    modalVisible: false,
    modalType: ModalType.Deliver,
    modalData: {},
    paymentInfo: {},
  };

  getBtnNum = row => {
    const { status, payStatus } = row;
    let btnNum = 0;
    const showConfirm = status === OrderStatus.Unconfirmed;
    const showReject = status === OrderStatus.Unconfirmed;
    const showDeliver = status === OrderStatus.InProduction;
    const showPaymentConfirm = payStatus === PayStatusValue.PaymentConfirmation;
    if (showConfirm) btnNum += 1;
    if (showReject) btnNum += 1;
    if (showDeliver) btnNum += 1;
    if (showPaymentConfirm) btnNum += 1;
    return { showReject, showConfirm, showDeliver, showPaymentConfirm, btnNum };
  };

  rightBtn = row => {
    const { showReject, showConfirm, showDeliver, showPaymentConfirm } = this.getBtnNum(row);
    const btnList = [
      showConfirm && (
        <a onClick={() => this.handleConfirmModalShow(row, ModalType.Confirm)}>
          {formatMessage({ id: 'yeeorder.Confirm' })}
        </a>
      ),
      showReject && (
        <a onClick={() => this.handleConfirmModalShow(row, ModalType.Reject)}>
          {formatMessage({ id: 'yeeorder.Reject' })}
        </a>
      ),
      showDeliver && (
        <a onClick={() => this.handleConfirmModalShow(row, ModalType.Deliver)}>
          {formatMessage({ id: 'po.action.deliver' })}
        </a>
      ),
      showPaymentConfirm && (
        <a onClick={() => this.handleConfirmModalShow(row, ModalType.PaymentConfirm)}>
          {formatMessage({ id: 'po.pay-status.payment-confirmation' })}
        </a>
      ),
    ];
    return btnList;
  };

  handleConfirmModalShow = (row, modalType) => {
    this.setState({
      modalVisible: true,
      modalType,
      modalData: row,
    });
    if (modalType === ModalType.PaymentConfirm) this.getPaymentInfo(row.id);
  };

  // 获取订单的支付信息
  getPaymentInfo = id => {
    fetchPaymentInfo({ id }).then(async res => {
      const { success, data } = res;
      if (success) {
        const paymentInfo = await formatPaymentInfo(data);
        this.setState({ paymentInfo });
      }
    });
  };

  handleConfirmModalOk = () => {
    const { modalType } = this.state;
    if (modalType === ModalType.Deliver) {
      this.handleDeliver();
    } else if (modalType === ModalType.PaymentConfirm) {
      this.handlePaymentConfirm();
    } else if (modalType === ModalType.Confirm) {
      this.handleConfirm();
    } else if (modalType === ModalType.Reject) {
      this.handleReject();
    }
  };

  handleConfirm = () => {
    const {
      form: { validateFields },
    } = this.props;
    const { modalData } = this.state;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        id: modalData.id,
        ...values,
      };
      confirmOrder(params).then(res => {
        const { success } = res;
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.props.fetchData();
          });
        }
      });
    });
  };

  handleReject = () => {
    const {
      form: { validateFields },
    } = this.props;
    const { modalData } = this.state;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        id: modalData.id,
        ...values,
      };
      rejectOrder(params).then(res => {
        const { success } = res;
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.props.fetchData();
          });
        }
      });
    });
  };

  handleDeliver = () => {
    const {
      form: { validateFields },
    } = this.props;
    const { modalData } = this.state;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        id: modalData.id,
        ...values,
        blDate: moment(values.blDate).toISOString(),
      };
      // 字段替换和时间格式化
      deliver(params).then(res => {
        const { success } = res;
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.props.fetchData();
          });
        }
      });
    });
  };

  handlePaymentConfirm = () => {
    const { modalData, paymentInfo } = this.state;
    const params = {
      id: modalData.id,
      intialRemainFlag: paymentInfo.intialRemainFlag,
    };
    paymentConfirm(params).then(res => {
      const { success } = res;
      if (success) {
        message.success(formatMessage({ id: 'yeeorder.Success' }));
        this.setState({ modalVisible: false }, () => {
          this.props.fetchData();
        });
      }
    });
  };

  handleConfirmModalCancel = () => {
    this.setState({ modalVisible: false });
  };

  showDetail = row => router.push(`/po/${row.id}/detail`);

  render() {
    const { modalVisible, modalType, paymentInfo } = this.state;
    const { latestPO, form } = this.props;
    const columns = [
      {
        className: 'nowrap',
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        width: 10,
        fixed: 'left',
        render: (text, row, index) => `${index + 1}`,
        key: 'index',
      },
      {
        dataIndex: PONo.key,
        title: `${formatMessage({ id: PONo.text })}`,
        render: (val, row) => <a onClick={() => this.showDetail(row)}>{val}</a>,
      },
      {
        dataIndex: PoRaiseDate.key,
        title: `${formatMessage({ id: PoRaiseDate.text })}`,
        render: val => (val ? <DateIn18 date={val} fullTime /> : '--'),
      },
      {
        title: `${formatMessage({ id: LastUpdate.text })}`,
        dataIndex: LastUpdate.key,
        render: val => (val ? <DateIn18 date={val} fullTime /> : '--'),
      },
      {
        title: `${formatMessage({ id: Buyer.text })}`,
        dataIndex: Buyer.key,
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: `${formatMessage({ id: IncoTerms.text })}`,
        dataIndex: `${IncoTerms.key}Text`,
      },
      {
        title: `${formatMessage({ id: Amount.text })}`,
        dataIndex: `${Amount.key}Text`,
        align: 'right',
      },
      {
        title: `${formatMessage({ id: Status.text })}`,
        dataIndex: Status.key,
        render: (val, { qcResult, overdueFlag }) => (
          <Badge
            color={OrderStatusMap[val].color}
            text={
              <span
                className={
                  qcResult === QcStatus.Fail && val === OrderStatus.InQC ? styles.qcFail : ''
                }
              >
                {formatMessage({ id: OrderStatusMap[val].text })}
                {!!overdueFlag && (
                  <>
                    <br />
                    <span style={{ marginLeft: 16, color: 'red' }}>
                      ({formatMessage({ id: 'po.list.overdue' })})
                    </span>
                  </>
                )}
              </span>
            }
          />
        ),
      },
      {
        title: `${formatMessage({ id: PayStatus.text })}`,
        dataIndex: PayStatus.key,
        render: (val, row) => {
          const content =
            val === PayStatusValue.None ? (
              '--'
            ) : (
              <Badge color={PayStatusMap[val].color} text={row[`${PayStatus.key}Text`]} />
            );
          return content;
        },
      },
      {
        className: 'nowrap',
        title: `${formatMessage({ id: 'my-product.list.action' })}`,
        key: 'action',
        fixed: 'right',
        width: 10,
        render: row => {
          const btnList = this.rightBtn(row);
          return (
            <ActionList
              actions={[
                <a onClick={() => this.showDetail(row)}>
                  {formatMessage({ id: 'yeeorder.Details' })}
                </a>,
                ...btnList,
              ]}
            />
          );
        },
      },
    ];
    return (
      <Card
        title={formatMessage({ id: 'home.Latest-PO' })}
        bordered={false}
        extra={<Link to='/po'>{formatMessage({ id: 'yeeorder.More' })}</Link>}
        style={{ marginTop: '24px' }}
      >
        <Skeleton paragraph loading={!latestPO}>
          {latestPO && !!latestPO.length ? (
            <GeneralTable
              columns={columns}
              dataSource={latestPO}
              pagination={false}
              scroll={{ x: true }}
            />
          ) : (
            <Empty />
          )}
        </Skeleton>
        <Modal
          width='50%'
          title={formatMessage({ id: ModalTypeMap[modalType].title })}
          visible={modalVisible}
          onCancel={this.handleConfirmModalCancel}
          onOk={this.handleConfirmModalOk}
          okText={formatMessage({ id: 'yeeorder.Confirm' })}
        >
          {modalType === ModalType.Confirm && <ConfirmContent form={form} />}
          {modalType === ModalType.Reject && <RejectContent form={form} />}
          {modalType === ModalType.Deliver && <DeliverContent form={form} />}
          {modalType === ModalType.PaymentConfirm && <PaymentContent paymentInfo={paymentInfo} />}
        </Modal>
      </Card>
    );
  }
}

export default Form.create()(LatestPO);
