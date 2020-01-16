import { Card, Descriptions, Button } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import DateIn18 from '@common/components/DateIn18';
import _get from 'lodash/get';
import router from 'umi/router';
import { connect } from 'dva';
import RfqContent from './RfqContent';
import { RfqDetailKeys, RfqStatus, QutoesStatus } from '../enum';
import { checkRfqFlag } from '@/services/rfq';
import styles from '../style.less';

const {
  RFQNO,
  Status,
  Quote,
  QuoteProductName,
  QuoteItemNo,
  QuoteUnitPrice,
  QuoteProductQuantity,
  QuoteMOQ,
  QuoteProductPhoto,
  QuoteProductDetails,
  Sample,
  OfferSample,
  OfferFreeSample,
  UnitPrice,
  Remark,
  ExpectedDeliveryDate,
} = RfqDetailKeys;

@connect(({ rfq, loading }) => ({
  rfqDetail: rfq.rfqDetail,
  pageLoading: loading.effects['rfq/fetchRfqDetail'],
}))
class RFQDetails extends Component {
  state = {};

  componentDidMount() {
    this.fetchRfqDetailMethod();
  }

  fetchRfqDetailMethod = () => {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    const { qutoesStatus } = this.props.location.query;
    dispatch({
      type: 'rfq/fetchRfqDetail',
      payload: {
        id: Number(id),
        qutoesStatus: Number(qutoesStatus),
      },
    });
  };

  handleQuote = inquiryNo => {
    checkRfqFlag({ inquiryNo }).then(({ success }) => {
      if (success) {
        router.push(`/rfq/${inquiryNo}/quote`);
      } else {
        this.fetchRfqDetailMethod();
      }
    });
  };

  render() {
    const { pageLoading } = this.props;
    const { qutoesStatus = QutoesStatus.UnQutoed } = this.props.location.query;
    const inquiryStatus = _get(this.props, 'rfqDetail.inquiryOperaDetailDTO.inquiryStatus', '');
    const inquiryNo = _get(this.props, 'rfqDetail.inquiryOperaDetailDTO.inquiryNo', '');
    const inquiryOperaDetailDTO = _get(this.props, 'rfqDetail.inquiryOperaDetailDTO', {}); // rfq的基本信息
    const offerDetailDTO = _get(this.props, 'rfqDetail.offerDetailDTO', {}); // rfq的报价信息
    const offerSample = _get(this.props, 'rfqDetail.offerDetailDTO.needSample', 0);
    const offerFreeSample = _get(
      this.props,
      'rfqDetail.offerDetailDTO.sampleInfoDetailDTO.offerFreeSample',
      0,
    );
    const sampleInfoDetailDTO =
      _get(this.props, 'rfqDetail.offerDetailDTO.sampleInfoDetailDTO', {}) || {};
    return (
      <PageHeaderWrapper
        title={`${formatMessage({ id: RFQNO.label })}: ${inquiryOperaDetailDTO[RFQNO.key] || '--'}`}
        content={<RfqContent rfqDetail={inquiryOperaDetailDTO} loading={pageLoading} />}
        extra={
          <>
            <span>
              {formatMessage({ id: Status.label })}:{' '}
              {// 未报价之前，显示rfq状态；已报价显示Quote
              Number(qutoesStatus) === QutoesStatus.HasQutoed
                ? `${formatMessage({ id: 'rfq.detail.quote' })}`
                : inquiryOperaDetailDTO[`${Status.key}Text`]}
            </span>
            {[RfqStatus.Pass, RfqStatus.Offering].includes(inquiryStatus) &&
              Number(qutoesStatus) === QutoesStatus.UnQutoed && (
                <Button type='primary' onClick={() => this.handleQuote(inquiryNo)}>
                  {formatMessage({ id: 'rfq.received.quote-now' })}
                </Button>
              )}
          </>
        }
      >
        {Number(qutoesStatus) === QutoesStatus.HasQutoed && (
          <Card title={formatMessage({ id: Quote.label })} bordered={false}>
            <Descriptions>
              <Descriptions.Item span={3} label={formatMessage({ id: QuoteProductName.label })}>
                {offerDetailDTO[QuoteProductName.key] || '--'}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={formatMessage({ id: QuoteItemNo.label })}>
                {offerDetailDTO[QuoteItemNo.key] || '--'}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={formatMessage({ id: QuoteUnitPrice.label })}>
                {offerDetailDTO[`${QuoteUnitPrice.key}Text`] || '--'} /{' '}
                {offerDetailDTO.quantityUnitText || '--'}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={formatMessage({ id: QuoteProductQuantity.label })}>
                {offerDetailDTO[`${QuoteProductQuantity.key}Text`] || '--'}{' '}
                {offerDetailDTO.quantityUnitText || '--'}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={formatMessage({ id: QuoteMOQ.label })}>
                {offerDetailDTO[`${QuoteMOQ.key}Text`] || '--'}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item
                className={
                  offerDetailDTO[QuoteProductPhoto.key] &&
                  offerDetailDTO[QuoteProductPhoto.key].length
                    ? styles.imgRow
                    : ''
                }
                label={formatMessage({ id: QuoteProductPhoto.label })}
              >
                {offerDetailDTO[QuoteProductPhoto.key] &&
                offerDetailDTO[QuoteProductPhoto.key].length ? (
                  <UploadList
                    disabled
                    value={offerDetailDTO[QuoteProductPhoto.key] || []}
                    listType='picture-card'
                    maxLength={0}
                  />
                ) : (
                  '--'
                )}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item span={3} label={formatMessage({ id: QuoteProductDetails.label })}>
                <p style={{ width: '100%', wordBreak: 'break-word' }}>
                  {offerDetailDTO[QuoteProductDetails.key] || '--'}
                </p>
              </Descriptions.Item>
            </Descriptions>
            <Descriptions title={formatMessage({ id: Sample.label })}>
              <Descriptions.Item label={formatMessage({ id: OfferSample.label })}>
                {offerSample
                  ? `${formatMessage({ id: 'yeeorder.Yes' })}`
                  : `${formatMessage({ id: 'yeeorder.No' })}`}
              </Descriptions.Item>
              {offerSample && (
                <Descriptions.Item span={2} label={formatMessage({ id: OfferFreeSample.label })}>
                  {offerFreeSample
                    ? `${formatMessage({ id: 'yeeorder.Free' })}`
                    : `${formatMessage({ id: 'yeeorder.No' })}`}
                </Descriptions.Item>
              )}
            </Descriptions>
            <Descriptions>
              {offerSample && !offerFreeSample && (
                <Descriptions.Item label={formatMessage({ id: UnitPrice.label })}>
                  {sampleInfoDetailDTO.unitPriceText || '--'} /{' '}
                  {sampleInfoDetailDTO.sampleUomText || '--'}
                </Descriptions.Item>
              )}
              {offerSample && (
                <Descriptions.Item label={formatMessage({ id: ExpectedDeliveryDate.label })}>
                  {sampleInfoDetailDTO[ExpectedDeliveryDate.key] ? (
                    <DateIn18 val={sampleInfoDetailDTO[ExpectedDeliveryDate.key]} />
                  ) : (
                    '--'
                  )}
                </Descriptions.Item>
              )}
            </Descriptions>
            {!!offerSample && (
              <Descriptions>
                <Descriptions.Item span={3} label={formatMessage({ id: Remark.label })}>
                  <p style={{ width: '100%', wordBreak: 'break-word' }}>
                    {sampleInfoDetailDTO[Remark.key] || '--'}
                  </p>
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default RFQDetails;
