import { Form, Card, Badge, Modal, message, Typography, Tooltip } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import POSearchForm from './SearchForm';
import DeliverContent from '../components/DeliverContent';
import PaymentContent from '../components/PaymentContent';
import ConfirmContent from '../components/ConfirmContent';
import RejectContent from '../components/RejectContent';
import {
  ListKeys,
  OrderStatus,
  OrderStatusMap,
  PayStatusValue,
  PayStatusMap,
  QcStatus,
  ModalType,
  ModalTypeMap,
  TabText,
} from '../enum';
import {
  deliver,
  fetchPaymentInfo,
  paymentConfirm,
  confirmOrder,
  rejectOrder,
} from '@/services/po';
import { formatPaymentInfo } from '../util';
import styles from '../style.less';

const getValuefromUrl = val => (val ? Number(val) : undefined);
const { Paragraph } = Typography;
const { PONo, PoRaiseDate, LastUpdate, Buyer, IncoTerms, Amount, Status, PayStatus } = ListKeys;

@connect(({ po, loading }) => ({
  poData: po.poData,
  tableLoading: loading.effects['po/fetchPoList'],
}))
class TabWrapper extends Component {
  state = {
    searchParams: {
      orderNo: undefined,
      poRaiseDate: undefined,
      companyName: undefined,
      status: getValuefromUrl(this.props.location.query.status),
      overdueFlag: getValuefromUrl(this.props.location.query.overdueFlag),
    },
    modalVisible: false,
    modalType: ModalType.Deliver,
    modalData: {},
    paymentInfo: {},
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(preProps) {
    if (preProps.activeTab !== this.props.activeTab) {
      const { activeTab } = this.props;
      const { searchParams } = this.state;
      this.setState(
        {
          searchParams: {
            ...searchParams,
            status: TabText[Number(activeTab)].status,
          },
        },
        () => this.fetchData(),
      );
    }
  }

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

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => this.fetchData(),
    );
  };

  handlePageChange = pagination => {
    const { dispatch, activeTab } = this.props;
    const { searchParams } = this.state;
    const params = {
      titleStatus: activeTab,
      ...searchParams,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'po/fetchPoList',
      payload: params,
    });
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

  // 点击modal的ok按钮
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

  // 确认订单
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
            this.fetchData();
            this.props.fetchStatusStaic();
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
            this.fetchData();
            this.props.fetchStatusStaic();
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
            this.fetchData();
            this.props.fetchStatusStaic();
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
          this.fetchData();
          this.props.fetchStatusStaic();
        });
      }
    });
  };

  handleConfirmModalCancel = () => {
    this.setState({ modalVisible: false });
  };

  showDetail = row => router.push(`/po/${row.id}/detail`);

  fetchData() {
    const { dispatch, activeTab } = this.props;
    const { searchParams } = this.state;
    const params = {
      titleStatus: activeTab,
      pageNo: 1,
      pageSize: 10,
      ...searchParams,
    };
    dispatch({
      type: 'po/fetchPoList',
      payload: params,
    });
  }

  render() {
    const { modalVisible, modalType, paymentInfo, searchParams } = this.state;
    const { poData, tableLoading, form, location, activeTab } = this.props;
    const { current, pageSize } = poData.pagination;
    const columns = [
      {
        className: 'nowrap',
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        width: 10,
        fixed: 'left',
        render: (text, row, index) => `${(current - 1) * pageSize + (index + 1)}`,
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
        render: val => <DateIn18 date={val} fullTime />,
      },
      {
        title: `${formatMessage({ id: LastUpdate.text })}`,
        dataIndex: LastUpdate.key,
        render: val => <DateIn18 date={val} fullTime />,
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
        render: (val, { qcResult, overdueFlag, statusText }) => (
          <Badge
            color={OrderStatusMap[val].color}
            text={
              <span
                className={
                  qcResult === QcStatus.Fail && val === OrderStatus.InQC ? styles.qcFail : ''
                }
              >
                {statusText}
                {!!overdueFlag && (
                  <p style={{ marginLeft: 16, color: 'red' }}>
                    ({formatMessage({ id: 'po.list.overdue' })})
                  </p>
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
        width: 10,
        fixed: 'right',
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
      <>
        <Card bordered={false}>
          <POSearchForm
            location={location}
            tabValue={activeTab}
            searchParams={searchParams}
            handleSearch={this.handleSearch}
          />
          <GeneralTable
            loading={tableLoading}
            rowKey='id'
            scroll={{ x: true }}
            columns={columns}
            dataSource={poData.list}
            pagination={poData.pagination}
            onChange={this.handlePageChange}
          />
        </Card>
        <Modal
          width='50%'
          title={formatMessage({ id: ModalTypeMap[modalType].title })}
          visible={modalVisible}
          onCancel={this.handleConfirmModalCancel}
          onOk={this.handleConfirmModalOk}
          okText={formatMessage({ id: 'yeeorder.Confirm' })}
          destroyOnClose
        >
          {modalType === ModalType.Confirm && <ConfirmContent form={form} />}
          {modalType === ModalType.Reject && <RejectContent form={form} />}
          {modalType === ModalType.Deliver && <DeliverContent form={form} />}
          {modalType === ModalType.PaymentConfirm && <PaymentContent paymentInfo={paymentInfo} />}
        </Modal>
      </>
    );
  }
}

export default Form.create()(TabWrapper);
