import { Badge, Button, Card, Form, Typography, Popover, Modal, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import { confirmOrder, rejectOrder, paymentConfirmation, deliverOrder } from '@/services/sample';
import { StatusValue, StatusMap, ModalType, ModalTitle } from '../enum';
import SearchForm from './SearchForm';
import ConfirmDialog from '../components/ConfirmDialog';
import DeliverDialog from '../components/DeliverDialog';
import PaymentDialog from '../components/PaymentDialog';
import RejectDialog from '../components/RejectDialog';
import styles from '../style.less';

const { Paragraph } = Typography;

@connect(({ sample, loading }) => ({
  sampleData: sample.sampleData,
  tableLoading: loading.effects['sample/fetchSample'],
}))
class SampleManagement extends Component {
  state = {
    searchParams: {},
    modalType: ModalType.Confirm, // 操作类型
    modalVisible: false, // 显示隐藏弹框
    handleRow: null, // 操作对象
  };

  componentDidMount() {
    this.fetchSampleMethod();
  }

  fetchSampleMethod = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch } = this.props;
    const { searchParams } = this.state;
    const params = {
      ...pageInfo,
      ...searchParams,
    };
    dispatch({
      type: 'sample/fetchSample',
      payload: params,
    });
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchSampleMethod();
      },
    );
  };

  changePage = ({ current: pageNo, pageSize }) => this.fetchSampleMethod({ pageNo, pageSize });

  showDetail = val => router.push(`/sample/${val}/detail`);

  showDialog = (row, type) => {
    this.setState({
      modalType: type,
      modalVisible: true,
      handleRow: row,
    });
  };

  handleConfirm = values => {
    const { handleRow } = this.state;
    const params = {
      id: handleRow.id,
      ...values,
    };
    confirmOrder(params).then(({ success }) => {
      if (success) {
        this.setState(
          {
            modalVisible: false,
          },
          () => {
            this.fetchSampleMethod();
          },
        );
      }
    });
  };

  handleReject = values => {
    const { handleRow } = this.state;
    const params = {
      sampleOrderId: handleRow.id,
      ...values,
    };
    rejectOrder(params).then(({ success }) => {
      if (success) {
        this.setState(
          {
            modalVisible: false,
          },
          () => {
            this.fetchSampleMethod();
          },
        );
      }
    });
  };

  handlePayment = () => {
    const { handleRow } = this.state;
    const params = {
      id: handleRow.id,
    };
    paymentConfirmation(params).then(({ success }) => {
      if (success) {
        this.setState(
          {
            modalVisible: false,
          },
          () => {
            this.fetchSampleMethod();
          },
        );
      }
    });
  };

  handleDeliver = values => {
    const { handleRow } = this.state;
    const { actualDeliveryDate } = values;
    const params = {
      sampleOrderId: handleRow.id,
      ...values,
      actualDeliveryDate: moment(actualDeliveryDate).toISOString(),
    };
    deliverOrder(params).then(({ success }) => {
      if (success) {
        this.setState(
          {
            modalVisible: false,
          },
          () => {
            this.fetchSampleMethod();
          },
        );
      }
    });
  };

  handleOk = () => {
    const {
      form: { validateFields },
    } = this.props;
    const { modalType } = this.state;
    validateFields((err, values) => {
      if (!err) {
        switch (modalType) {
          case ModalType.Confirm:
            this.handleConfirm(values);
            break;
          case ModalType.Reject:
            this.handleReject(values);
            break;
          case ModalType.Payment:
            this.handlePayment();
            break;
          case ModalType.Deliver:
            this.handleDeliver(values);
            break;
          default:
            break;
        }
      }
    });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  getBtnNum = row => {
    const { sampleStatus } = row;
    let btnNum = 0;
    const showConfirm = sampleStatus === StatusValue.Unconfirmed;
    const showReject = sampleStatus === StatusValue.Unconfirmed;
    const showPaymentConfirmation = sampleStatus === StatusValue.Payment_Confirmation;
    const showDeliver = sampleStatus === StatusValue.In_Production;
    if (showConfirm) btnNum += 1;
    if (showReject) btnNum += 1;
    if (showPaymentConfirmation) btnNum += 1;
    if (showDeliver) btnNum += 1;
    return { showConfirm, showReject, showPaymentConfirmation, showDeliver, btnNum };
  };

  rightBtn = row => {
    const { showConfirm, showReject, showPaymentConfirmation, showDeliver } = this.getBtnNum(row);
    const btnList = [
      showConfirm && (
        <a onClick={() => this.showDialog(row, ModalType.Confirm)}>
          {`${formatMessage({ id: 'yeeorder.Confirm' })}`}
        </a>
      ),
      showReject && (
        <a onClick={() => this.showDialog(row, ModalType.Reject)}>
          {`${formatMessage({ id: 'yeeorder.Reject' })}`}
        </a>
      ),
      showPaymentConfirmation && (
        <a onClick={() => this.showDialog(row, ModalType.Payment)}>
          {`${formatMessage({ id: 'sample.management.paymentConfirmation' })}`}
        </a>
      ),
      showDeliver && (
        <a onClick={() => this.showDialog(row, ModalType.Deliver)}>
          {`${formatMessage({ id: 'sample.management.deliver' })}`}
        </a>
      ),
    ];
    return btnList;
  };

  render() {
    const { modalType, modalVisible, handleRow } = this.state;
    const { sampleData, tableLoading, form } = this.props;
    const { current, pageSize } = sampleData.pagination;
    const columns = [
      {
        className: 'nowrap',
        width: 10,
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        fixed: 'left',
        render: (text, record, index) => `${(current - 1) * pageSize + (index + 1)}`,
        key: 'index',
      },
      {
        className: 'nowrap',
        title: formatMessage({ id: 'sample.management.sample-no' }),
        dataIndex: 'sampleNo',
        fixed: 'left',
        width: 10,
        render: (val, { id }) => <a onClick={() => this.showDetail(id)}>{val}</a>,
      },
      {
        title: formatMessage({ id: 'sample.management.sample-raise-time' }),
        dataIndex: 'gmtCreate',
        render: val => (val ? <DateIn18 date={val} fullTime /> : '--'),
      },
      {
        title: formatMessage({ id: 'sample.management.last-update' }),
        dataIndex: 'gmtUpdate',
        render: val => (val ? <DateIn18 date={val} fullTime /> : '--'),
      },
      {
        title: formatMessage({ id: 'sample.management.buyer' }),
        dataIndex: 'purchaseName',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'sample.management.amount' }),
        dataIndex: 'totalAmountText',
        render: (val, { offerFreeSample }) => {
          const renderDom = !offerFreeSample ? val : `${formatMessage({ id: 'yeeorder.Free' })}`;
          return renderDom;
        },
        align: 'right',
      },
      {
        title: formatMessage({ id: 'sample.management.status' }),
        dataIndex: 'sampleStatus',
        render: (val, { rejectReason }) => {
          const status = StatusMap[val];
          return (
            <Badge
              color={status && status.color}
              text={
                val === StatusValue.Rejected ? (
                  <>
                    <span>{status ? formatMessage({ id: status.text }) : '--'}</span>
                    <Popover
                      content={
                        <p style={{ maxWidth: 200, wordBreak: 'break-all' }}>
                          {rejectReason || '--'}
                        </p>
                      }
                      trigger='hover'
                    >
                      <Button type='link'>{formatMessage({ id: 'yeeorder.Reason' })}</Button>
                    </Popover>
                  </>
                ) : (
                  <span>{status ? formatMessage({ id: status.text }) : '--'}</span>
                )
              }
            />
          );
        },
      },
      {
        className: 'nowrap',
        width: 10,
        title: formatMessage({ id: 'sample.management.action' }),
        fixed: 'right',
        render: row => {
          const btnList = this.rightBtn(row);
          return (
            <ActionList
              actions={[
                <a onClick={() => this.showDetail(row.id)}>
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
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm handleSearch={this.handleSearch} />
            <GeneralTable
              rowKey='id'
              loading={tableLoading}
              columns={columns}
              dataSource={sampleData.list}
              pagination={sampleData.pagination}
              scroll={{ x: true }}
              onChange={this.changePage}
            />
          </div>
        </Card>
        <Modal
          width='50%'
          title={formatMessage({ id: ModalTitle[modalType] })}
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={formatMessage({ id: 'yeeorder.Confirm' })}
          cancelText={formatMessage({ id: 'yeeorder.Cancel' })}
          destroyOnClose
        >
          <Form>
            {modalType === ModalType.Confirm && <ConfirmDialog form={form} />}
            {modalType === ModalType.Reject && <RejectDialog form={form} />}
            {modalType === ModalType.Deliver && <DeliverDialog form={form} />}
            {modalType === ModalType.Payment && <PaymentDialog detail={handleRow} />}
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(SampleManagement);
