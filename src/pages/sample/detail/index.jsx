import React, { Component } from 'react';
import { Card, Descriptions, Typography, Button, Modal, Form, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import DateIn18 from '@common/components/DateIn18';
import UploadList from '@common/components/UploadList';
import _get from 'lodash/get';
import {
  fetchSampleDetail,
  confirmOrder,
  rejectOrder,
  paymentConfirmation,
  deliverOrder,
} from '@/services/sample';
import { DetailKeys, StatusValue, ModalType, ModalTitle } from '../enum';
import RejectDialog from '../components/RejectDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import PaymentDialog from '../components/PaymentDialog';
import DeliverDialog from '../components/DeliverDialog';
import styles from '../style.less';

const {
  SampleNO,
  SampleRaiseDate,
  Status,
  TotalAmount,
  Buyer,
  BuyerContact,
  BuyerEmail,
  SamplePhoto,
  ProductName,
  ProductPrice,
  ProductQuantity,
  ProductDetail,
  ConsigneeName,
  ConsigneeTel,
  ConsigneeAddress,
  ProformaInvoice,
  DeliverDate,
  LogisticsProvider,
  LogisticsNo,
  RejectReason,
} = DetailKeys;

class SampleDetail extends Component {
  state = {
    detail: {},
    modalType: ModalType.Confirm, // 操作类型
    modalVisible: false, // 显示隐藏弹框
  };

  componentDidMount() {
    this.fetchSampleDetailMethod();
  }

  fetchSampleDetailMethod = () => {
    const { id } = this.props.match.params;
    fetchSampleDetail({ id }).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({ detail: data });
      }
    });
  };

  showDialog = type => {
    this.setState({
      modalType: type,
      modalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleConfirm = values => {
    const { detail } = this.state;
    const params = {
      id: detail.id,
      ...values,
    };
    confirmOrder(params).then(({ success }) => {
      if (success) {
        this.setState(
          {
            modalVisible: false,
          },
          () => {
            this.fetchSampleDetailMethod();
          },
        );
      }
    });
  };

  handleReject = values => {
    const { detail } = this.state;
    const params = {
      sampleOrderId: detail.id,
      ...values,
    };
    rejectOrder(params).then(({ success }) => {
      if (success) {
        this.setState(
          {
            modalVisible: false,
          },
          () => {
            this.fetchSampleDetailMethod();
          },
        );
      }
    });
  };

  handlePayment = () => {
    const { detail } = this.state;
    const params = {
      id: detail.id,
    };
    paymentConfirmation(params).then(({ success }) => {
      if (success) {
        this.setState(
          {
            modalVisible: false,
          },
          () => {
            this.fetchSampleDetailMethod();
          },
        );
      }
    });
  };

  handleDeliver = values => {
    const { detail } = this.state;
    const { actualDeliveryDate } = values;
    const params = {
      sampleOrderId: detail.id,
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
            this.fetchSampleDetailMethod();
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

  render() {
    const { form } = this.props;
    const { detail, modalType, modalVisible } = this.state;
    const samplePhoto = detail[SamplePhoto.key] || [];
    const { proformaInvoiceList } = detail;
    const sampleLogisticsDTO = _get(this.state, 'detail.sampleLogisticsDTO', {}) || {};
    const buyerCompanyDTO = _get(this.state, 'detail.buyerCompanyDTO', {}) || {};
    const { sampleStatus } = detail;
    const Action = () => (
      <>
        {sampleStatus === StatusValue.Unconfirmed && (
          <>
            <Button onClick={() => this.showDialog(ModalType.Reject)}>
              {formatMessage({ id: 'yeeorder.Reject' })}
            </Button>
            <Button type='primary' onClick={() => this.showDialog(ModalType.Confirm)}>
              {formatMessage({ id: 'yeeorder.Confirm' })}
            </Button>
          </>
        )}
        {sampleStatus === StatusValue.Payment_Confirmation && (
          <Button type='primary' onClick={() => this.showDialog(ModalType.Payment)}>
            {formatMessage({ id: 'sample.management.paymentConfirmation' })}
          </Button>
        )}
        {sampleStatus === StatusValue.In_Production && (
          <Button type='primary' onClick={() => this.showDialog(ModalType.Deliver)}>
            {formatMessage({ id: 'sample.management.deliver' })}
          </Button>
        )}
      </>
    );
    const footerBtn = (
      <>
        <Button onClick={() => this.handleCancel()}>
          {formatMessage({ id: 'yeeorder.Cancel' })}
        </Button>
        <Button type='primary' onClick={() => this.handleOk()}>
          {formatMessage({ id: 'yeeorder.Confirm' })}
        </Button>
      </>
    );
    const description = (
      <>
        <Descriptions>
          <Descriptions.Item label={formatMessage({ id: SampleNO.label })}>
            {detail[SampleNO.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: SampleRaiseDate.label })}>
            {detail[SampleRaiseDate.key] ? (
              <DateIn18 date={detail[SampleRaiseDate.key]} fullTime />
            ) : (
              '--'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Status.label })}>
            {detail[`${Status.key}Text`] || '--'}
            {detail[Status.key] === StatusValue.Rejected && ( // 如果订单被拒绝，浮窗显示原因
              <Tooltip placement='bottomRight' title={detail[RejectReason.key] || '--'}>
                <a style={{ marginLeft: 16 }}>{formatMessage({ id: RejectReason.label })}</a>
              </Tooltip>
            )}
          </Descriptions.Item>
        </Descriptions>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title style={{ margin: 0, marginRight: 16 }} level={4}>
            {formatMessage({ id: 'sample.detail.payment' })}
          </Typography.Title>
          <p style={{ flex: 1, margin: 0, borderBottom: '1px dashed #e8e8e8' }}></p>
        </div>
        <Descriptions column={1}>
          <Descriptions.Item label={formatMessage({ id: TotalAmount.label })}>
            {/**
              1.offerFreeSample = 1,免费提供样品;
              2.offerFreeSample = 0,有偿提供样品;
              3.已支付后显示detail按钮;
            */}
            {!!detail.offerFreeSample && `${formatMessage({ id: 'sample.detail.free' })}`}
            {!detail.offerFreeSample &&
              (detail[`${TotalAmount.key}Text`] ? (
                <strong style={{ marginRight: 16, fontSize: '120%', color: 'rgba(0, 0, 0, 0.85)' }}>
                  {detail[`${TotalAmount.key}Text`]}
                </strong>
              ) : (
                '--'
              ))}
            {[
              StatusValue.In_Production,
              StatusValue.In_Transit,
              StatusValue.Completed,
              StatusValue.Payment_Confirmation,
            ].includes(sampleStatus) &&
              !detail.offerFreeSample && (
                <Button type='link' onClick={() => this.showDialog(ModalType.PaymentDetails)}>
                  {formatMessage({ id: 'yeeorder.Detail' })}
                </Button>
              )}
          </Descriptions.Item>
        </Descriptions>
      </>
    );
    return (
      <PageHeaderWrapper extra={<Action />} className={styles.pageHeader} content={description}>
        <Card bordered={false}>
          <Descriptions title={formatMessage({ id: 'sample.detail.buyer-details' })}>
            <Descriptions.Item span={3} label={formatMessage({ id: Buyer.label })}>
              {buyerCompanyDTO[Buyer.key] || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: BuyerContact.label })}>
              {buyerCompanyDTO[BuyerContact.key] || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: BuyerEmail.label })}>
              {buyerCompanyDTO[BuyerEmail.key] || '--'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            title={formatMessage({ id: 'sample.detail.sample-information' })}
            column={3}
          >
            <Descriptions.Item span={3} className='samplePhoto'>
              {samplePhoto && !!samplePhoto.length ? (
                <UploadList
                  disabled
                  value={samplePhoto || []}
                  listType='picture-card'
                  maxLength={0}
                />
              ) : (
                '--'
              )}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={formatMessage({ id: ProductName.label })}>
              {detail[ProductName.key] || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: ProductPrice.label })}>
              {!detail.offerFreeSample
                ? `${detail[`${ProductPrice.key}Text`] || '--'} / ${detail.quantityUnitText ||
                    '--'}`
                : `${formatMessage({ id: 'yeeorder.Free' })}`}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: ProductQuantity.label })}>
              {detail[`${ProductQuantity.key}Text`] || '--'} {detail.quantityUnitText || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: TotalAmount.label })}>
              {!detail.offerFreeSample
                ? detail[`${TotalAmount.key}Text`] || '--'
                : `${formatMessage({ id: 'yeeorder.Free' })}`}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label={formatMessage({ id: ProductDetail.label })}>
              {detail[ProductDetail.key] || '--'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            title={formatMessage({ id: 'sample.detail.shipment-details' })}
          ></Descriptions>
          <Descriptions title={formatMessage({ id: 'sample.detail.consignee' })}>
            <Descriptions.Item label={formatMessage({ id: ConsigneeName.label })}>
              {detail[ConsigneeName.key] || '--'}
            </Descriptions.Item>
            <Descriptions.Item span={2} label={formatMessage({ id: ConsigneeTel.label })}>
              {detail[ConsigneeTel.key] || '--'}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={formatMessage({ id: ConsigneeAddress.label })}>
              {detail[ConsigneeAddress.key] || '--'}
            </Descriptions.Item>
          </Descriptions>
          {proformaInvoiceList && !!proformaInvoiceList.length && (
            <Descriptions title={formatMessage({ id: 'sample.detail.payment' })}>
              <Descriptions.Item
                className={styles.imgRow}
                label={formatMessage({ id: ProformaInvoice.label })}
              >
                {
                  <UploadList
                    disabled
                    value={proformaInvoiceList || []}
                    listType='picture-card'
                    maxLength={0}
                  />
                }
              </Descriptions.Item>
            </Descriptions>
          )}
          {[StatusValue.In_Transit, StatusValue.Completed].includes(sampleStatus) && (
            <Descriptions title={formatMessage({ id: 'sample.detail.logistics' })}>
              <Descriptions.Item label={formatMessage({ id: DeliverDate.label })}>
                {sampleLogisticsDTO[DeliverDate.key] ? (
                  <DateIn18 date={sampleLogisticsDTO[SampleRaiseDate.key]} />
                ) : (
                  '--'
                )}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: LogisticsProvider.label })}>
                {sampleLogisticsDTO[LogisticsProvider.key] || '--'}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: LogisticsNo.label })}>
                {sampleLogisticsDTO[LogisticsNo.key] || '--'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
        <Modal
          width='50%'
          title={formatMessage({ id: ModalTitle[modalType] })}
          visible={modalVisible}
          onCancel={this.handleCancel}
          footer={modalType !== ModalType.PaymentDetails && footerBtn}
          destroyOnClose
        >
          <Form>
            {modalType === ModalType.Confirm && <ConfirmDialog form={form} />}
            {modalType === ModalType.Reject && <RejectDialog form={form} />}
            {modalType === ModalType.Deliver && <DeliverDialog form={form} />}
            {modalType === ModalType.Payment && <PaymentDialog detail={detail} />}
            {modalType === ModalType.PaymentDetails && <PaymentDialog detail={detail} />}
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(SampleDetail);
