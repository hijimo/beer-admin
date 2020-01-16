import { Card, Tabs, Descriptions, Modal, Form, message } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import moment from 'moment';
import UploadList from '@common/components/UploadList';
import DateIn18 from '@common/components/DateIn18';
import _get from 'lodash/get';
import StatusStep from './StatusStep';
import ExtraActions from './ExtraActions';
import PoInfo from './PoInfo';
import PoLog from './PoLog';
import DeliverContent from '../components/DeliverContent';
import PaymentContent from '../components/PaymentContent';
import ConfirmContent from '../components/ConfirmContent';
import RejectContent from '../components/RejectContent';
import { paymentConfirm, confirmOrder, rejectOrder, deliver } from '@/services/po';
import { TabKeys, TabKeysMap, Detailkeys, ModalType, ModalTypeMap } from '../enum';

const { BLDate, BLProof } = Detailkeys;
@connect(({ po }) => ({
  poDetail: po.poDetail,
}))
class PODetail extends Component {
  state = {
    activeKey: TabKeys.PoInomation,
    modalVisible: false,
    modalType: ModalType.Deliver,
  };

  componentDidMount() {
    this.fetchQcDetailMethod();
  }

  fetchQcDetailMethod = () => {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'po/fetchPoDetail',
      payload: { id },
    });
  };

  handleTabChange = activeKey => {
    this.setState({ activeKey });
  };

  handleConfirmModalShow = modalType => {
    this.setState({ modalVisible: true, modalType });
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
      poDetail,
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        id: poDetail.id,
        ...values,
      };
      confirmOrder(params).then(res => {
        const { success } = res;
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.fetchQcDetailMethod();
          });
        }
      });
    });
  };

  handleReject = () => {
    const {
      form: { validateFields },
      poDetail,
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        id: poDetail.id,
        ...values,
      };
      rejectOrder(params).then(res => {
        const { success } = res;
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.fetchQcDetailMethod();
          });
        }
      });
    });
  };

  handleDeliver = () => {
    const {
      form: { validateFields },
      poDetail,
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        id: poDetail.id,
        ...values,
        blDate: moment(values.blDate).toISOString(),
      };
      deliver(params).then(res => {
        const { success } = res;
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.fetchQcDetailMethod();
          });
        }
      });
    });
  };

  handlePaymentConfirm = () => {
    const { poDetail } = this.props;
    const params = {
      id: poDetail.id,
      intialRemainFlag: poDetail.intialRemainFlag,
    };
    paymentConfirm(params).then(res => {
      const { success } = res;
      if (success) {
        message.success(formatMessage({ id: 'yeeorder.Success' }));
        this.setState({ modalVisible: false }, () => {
          this.fetchQcDetailMethod();
        });
      }
    });
  };

  handleConfirmModalCancel = () => {
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
    const { modalVisible, modalType, activeKey } = this.state;
    const { poDetail, form } = this.props;
    const orderExtDetailDTO = _get(this.props.poDetail, 'orderExtDetailDTO', {}) || {};
    const blProofList = _get(this.props.poDetail, 'orderExtDetailDTO.blProofList', []);
    const paymentInfo = this.formatPaymentInfo(poDetail);
    return (
      <PageHeaderWrapper
        content={<StatusStep poDetail={poDetail} />}
        extra={<ExtraActions poDetail={poDetail} handleClick={this.handleConfirmModalShow} />}
      >
        <Card bordered={false}>
          <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
            <Tabs.TabPane
              tab={formatMessage({ id: TabKeysMap[TabKeys.PoInomation] })}
              key={TabKeys.PoInomation}
            >
              <PoInfo poDetail={poDetail} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={formatMessage({ id: TabKeysMap[TabKeys.Logistics] })}
              key={TabKeys.Logistics}
            >
              <Descriptions>
                <Descriptions.Item span={3} label={formatMessage({ id: BLDate.label })}>
                  {orderExtDetailDTO[BLDate.key] ? (
                    <DateIn18 date={orderExtDetailDTO[BLDate.key]} />
                  ) : (
                    '--'
                  )}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={formatMessage({ id: BLProof.label })}>
                  {blProofList && blProofList.length ? (
                    <UploadList
                      disabled
                      value={blProofList || []}
                      listType='picture-card'
                      maxLength={0}
                    />
                  ) : (
                    '--'
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Tabs.TabPane>
            <Tabs.TabPane tab={formatMessage({ id: TabKeysMap[TabKeys.Log] })} key={TabKeys.Log}>
              <PoLog poDetail={poDetail} />
            </Tabs.TabPane>
          </Tabs>
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
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(PODetail);
