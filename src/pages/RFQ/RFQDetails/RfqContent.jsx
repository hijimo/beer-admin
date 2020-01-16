import React, { PureComponent } from 'react';
import { Descriptions, Icon, Skeleton } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import _get from 'lodash/get';
import DateIn18 from '@common/components/DateIn18';
import UploadList from '@common/components/UploadList';
import { RfqDetailKeys } from '../enum';
import styles from '../style.less';

const {
  Product,
  Buyer,
  Category,
  Quantity,
  ValidTo,
  RFQResealeDate,
  Description,
  ProductImage,
  OtherRequirement,
  IncoTerms,
  PreferredPrice,
  PaymentMethod,
  PortofLoading,
  NeedSample,
  ExpectedDeliveryDate,
  QuotesQuantity,
} = RfqDetailKeys;
class RfqContent extends PureComponent {
  state = {
    more: false,
  };

  handleMore = () => {
    const { more } = this.state;
    this.setState({ more: !more });
  };

  render() {
    const { more } = this.state;
    const { rfqDetail, loading } = this.props;
    const attachmentList = _get(this.props.rfqDetail, 'attachmentList', []);
    return (
      <Skeleton paragraph loading={loading}>
        <Descriptions title={rfqDetail[Buyer.key] || '--'}></Descriptions>
        <Descriptions title={rfqDetail[Product.key] || '--'}>
          <Descriptions.Item span={3} label={formatMessage({ id: Category.label })}>
            {rfqDetail[Category.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Quantity.label })}>
            {rfqDetail[`${Quantity.key}Text`] || '--'} {rfqDetail.productQuantityUnitText || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: ValidTo.label })}>
            {rfqDetail[ValidTo.key] ? <DateIn18 date={rfqDetail[ValidTo.key]} /> : '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: RFQResealeDate.label })}>
            {rfqDetail[RFQResealeDate.key] ? (
              <DateIn18 date={rfqDetail[RFQResealeDate.key]} fullTime />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item label={formatMessage({ id: Description.label })}>
            {rfqDetail[Description.key] || '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item
            className={attachmentList && attachmentList.length ? styles.imgRow : ''}
            label={formatMessage({ id: ProductImage.label })}
          >
            {attachmentList && attachmentList.length ? (
              <UploadList
                disabled
                value={rfqDetail[ProductImage.key] || []}
                listType='picture-card'
                maxLength={0}
              />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        {more && (
          <Descriptions title={formatMessage({ id: OtherRequirement.label })}>
            <Descriptions.Item label={formatMessage({ id: IncoTerms.label })}>
              {rfqDetail[`${IncoTerms.key}Text`] || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: PreferredPrice.label })}>
              {rfqDetail[`${PreferredPrice.key}Text`] || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: PaymentMethod.label })}>
              {rfqDetail[`${PaymentMethod.key}Text`] || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: PortofLoading.label })}>
              {rfqDetail[PortofLoading.key] || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: NeedSample.label })}>
              {rfqDetail[`${NeedSample.key}Text`] || '--'}
            </Descriptions.Item>
            {!!rfqDetail.needSample && (
              <Descriptions.Item label={formatMessage({ id: ExpectedDeliveryDate.label })}>
                {rfqDetail[ExpectedDeliveryDate.key] ? (
                  <DateIn18 date={rfqDetail[ExpectedDeliveryDate.key]} />
                ) : (
                  '--'
                )}
              </Descriptions.Item>
            )}
            <Descriptions.Item label={formatMessage({ id: QuotesQuantity.label })}>
              {rfqDetail[QuotesQuantity.key] || '--'}
            </Descriptions.Item>
          </Descriptions>
        )}
        <a type='link' onClick={this.handleMore}>
          {formatMessage({ id: more ? 'yeeorder.form.Less' : 'yeeorder.More' })}&nbsp;
          <Icon type={more ? 'up' : 'down'} />
        </a>
      </Skeleton>
    );
  }
}

export default RfqContent;
