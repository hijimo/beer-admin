import { Descriptions, Typography, Tooltip } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import GeneralTable from '@common/components/GeneralTable';
import DateIn18 from '@common/components/DateIn18';
import UploadList from '@common/components/UploadList';
import _get from 'lodash/get';
import { Detailkeys } from '../enum';
import styles from '../style.less';

const {
  Product,
  LineNo,
  ProductName,
  Spec,
  Price,
  Quantity,
  Amount,
  QC,
  TotalAmount,
  BuyerDetails,
  Buyer,
  BuyerContactName,
  BuyerEmail,
  ShipmentDetails,
  ShipmentContactName,
  ShipmentTelephone,
  ShipmentAddress,
  TermsConditions,
  TransportMode,
  IncoTerm,
  DestinatipnDueDate,
  ShippingInstructions,
  Payment,
  PaymentMethod,
  ProformaInvoice,
  ValueAddedServices,
  NeedQC,
  ProductDetails,
  QCAt,
  QCReport,
  QCSpec,
} = Detailkeys;
const { Paragraph } = Typography;

class PoInfo extends PureComponent {
  render() {
    const { poDetail } = this.props;
    const productList = _get(this.props.poDetail, 'orderProductDetailDTOList', []);
    const offerDetailDTO = _get(this.props.poDetail, 'offerDetailDTO');
    const orderExtDetailDTO = _get(this.props.poDetail, 'orderExtDetailDTO', {}) || {};
    const proformaInvoiceList = _get(this.props.poDetail, 'proformaInvoiceList', []) || [];
    const orderQcDetailDTO = _get(this.props.poDetail, 'orderQcDetailDTO', {}) || {};
    const qcSpecList = _get(this.props.poDetail, 'orderQcDetailDTO.qcSpecList', []) || [];
    const rfqNo = _get(this.props.poDetail, 'rfqNo', '');
    const columns = [
      {
        className: 'nowrap',
        width: 10,
        title: formatMessage({ id: LineNo.label }),
        fixed: 'left',
        render(val, row, index) {
          return index + 1;
        },
        key: 'index',
      },
      {
        title: formatMessage({ id: ProductName.label }),
        dataIndex: ProductName.key,
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: Spec.label }),
        dataIndex: Spec.key,
        render: val =>
          val.map(item => (
            <div
              key={item.productOptionId}
            >{`${item.productAttributeName}: ${item.productOptionValue}`}</div>
          )),
      },
      {
        title: formatMessage({ id: Price.label }),
        dataIndex: Price.key,
      },
      {
        title: formatMessage({ id: Quantity.label }),
        dataIndex: Quantity.key,
      },
      {
        title: formatMessage({ id: Amount.label }),
        dataIndex: Amount.key,
      },
      {
        title: formatMessage({ id: QC.label }),
        dataIndex: QC.key,
        render: val => (val ? `${formatMessage({ id: 'yeeorder.Need' })}` : '--'),
      },
    ];
    const rfqColumns = [
      {
        className: 'nowrap',
        width: 10,
        title: formatMessage({ id: LineNo.label }),
        fixed: 'left',
        render(val, row, index) {
          return index + 1;
        },
        key: 'index',
      },
      {
        title: formatMessage({ id: ProductName.label }),
        dataIndex: ProductName.key,
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: Price.label }),
        dataIndex: Price.key,
      },
      {
        title: formatMessage({ id: Quantity.label }),
        dataIndex: Quantity.key,
      },
      {
        title: formatMessage({ id: Amount.label }),
        dataIndex: Amount.key,
      },
      {
        title: formatMessage({ id: ProductDetails.label }),
        dataIndex: ProductDetails.key,
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
    ];
    return (
      <div className='poInfo'>
        <Descriptions title={formatMessage({ id: Product.label })}>
          <Descriptions.Item label={formatMessage({ id: TotalAmount.label })}>
            {poDetail[`${TotalAmount.key}Text`] || '--'}
          </Descriptions.Item>
        </Descriptions>
        <GeneralTable
          rowKey={(row, index) => index}
          scroll={{ x: true }}
          columns={rfqNo ? rfqColumns : columns}
          dataSource={rfqNo ? [offerDetailDTO] : productList}
          pagination={false}
        />
        <Descriptions title={formatMessage({ id: BuyerDetails.label })}>
          <Descriptions.Item span={3} label={formatMessage({ id: Buyer.label })}>
            {poDetail[Buyer.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: BuyerContactName.label })}>
            {poDetail[BuyerContactName.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: BuyerEmail.label })}>
            {poDetail[BuyerEmail.key] || '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title={formatMessage({ id: ShipmentDetails.label })}>
          <Descriptions.Item label={formatMessage({ id: ShipmentContactName.label })}>
            {orderExtDetailDTO[ShipmentContactName.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item span={2} label={formatMessage({ id: ShipmentTelephone.label })}>
            {orderExtDetailDTO[ShipmentTelephone.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={formatMessage({ id: ShipmentAddress.label })}>
            {orderExtDetailDTO[ShipmentAddress.key] || '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title={formatMessage({ id: TermsConditions.label })}>
          <Descriptions.Item label={formatMessage({ id: TransportMode.label })}>
            {orderExtDetailDTO[`${TransportMode.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: IncoTerm.label })}>
            {orderExtDetailDTO[`${IncoTerm.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: DestinatipnDueDate.label })}>
            {orderExtDetailDTO[DestinatipnDueDate.key] ? (
              <DateIn18 date={orderExtDetailDTO[DestinatipnDueDate.key]} />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item label={formatMessage({ id: ShippingInstructions.label })}>
            {orderExtDetailDTO[ShippingInstructions.key] || '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title={formatMessage({ id: Payment.label })}>
          <Descriptions.Item span={3} label={formatMessage({ id: PaymentMethod.label })}>
            {orderExtDetailDTO[`${PaymentMethod.key}Text`] || '--'}
          </Descriptions.Item>
          {proformaInvoiceList && !!proformaInvoiceList.length && (
            <Descriptions.Item
              className={proformaInvoiceList && !!proformaInvoiceList.length ? styles.imgRow : ''}
              label={formatMessage({ id: ProformaInvoice.label })}
            >
              <UploadList
                disabled
                value={proformaInvoiceList || []}
                listType='picture-card'
                maxLength={0}
              />
            </Descriptions.Item>
          )}
        </Descriptions>
        {orderQcDetailDTO[NeedQC.key] === 1 && (
          <>
            <Descriptions
              title={`${formatMessage({ id: ValueAddedServices.label })} - ${formatMessage({
                id: 'po.detail.qc',
              })}`}
            >
              <Descriptions.Item label={formatMessage({ id: NeedQC.label })}>
                {orderQcDetailDTO[`${NeedQC.key}Text`] || '--'}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: QCAt.label })}>
                {orderQcDetailDTO[`${QCAt.key}Text`] || '--'}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: QCReport.label })}>
                {orderQcDetailDTO[`${QCReport.key}Text`] || '--'}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item
                className={qcSpecList && !!qcSpecList.length ? styles.imgRow : ''}
                label={formatMessage({ id: QCSpec.label })}
              >
                {qcSpecList && !!qcSpecList.length ? (
                  <UploadList
                    disabled
                    value={qcSpecList || []}
                    listType='picture-card'
                    maxLength={0}
                  />
                ) : (
                  '--'
                )}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </div>
    );
  }
}

export default PoInfo;
