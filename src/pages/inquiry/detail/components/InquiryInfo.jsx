import React from 'react';
import { Avatar, Skeleton, Row, Col, Descriptions, Typography } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import config from '@common/config';
import { InquiryType } from '../enum';
import styles from '../index.less';

const { Paragraph } = Typography;
const { mallHost } = config;

const viewProduct = ({ spuNo, standardType }) => {
  window.open(`${mallHost}/products/${spuNo}?standardType=${standardType}`, '_blank');
};

const viewCompany = ({ selfRunFlag, companyNo }) => {
  const path = selfRunFlag
    ? `${mallHost}/companies/${companyNo}/categories`
    : `${mallHost}/companies/${companyNo}/showroom`;
  window.open(path, '_blank');
};

const InquiryInfo = ({ detail, loading }) => {
  const {
    productPhoto,
    productName,
    productPriceText,
    uomText,
    moqText,
    companyName,
    companyContact,
    inquiryType,
  } = detail || {};
  return (
    <Skeleton loading={loading} active>
      <Row gutter={12} type='flex'>
        {inquiryType === InquiryType.Product && (
          <Col span={12}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => viewProduct(detail)}
            >
              <div style={{ marginRight: 25 }}>
                <Avatar
                  shape='square'
                  size={58}
                  src={productPhoto && productPhoto.url}
                  style={{ display: 'block' }}
                />
              </div>
              <div className={styles.product}>
                <Paragraph ellipsis={{ rows: 2 }}>
                  <p style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{productName || '--'}</p>
                </Paragraph>
                <Descriptions column={4}>
                  <Descriptions.Item label={formatMessage({ id: 'yeeorder.price' })} span={2}>
                    {`${productPriceText || '--'} / ${uomText || '--'}`}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'yeeorder.moq' })} span={2}>
                    {moqText || '--'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Col>
        )}
        <Col span={12} className={styles.company} onClick={() => viewCompany(detail)}>
          <Descriptions column={1}>
            <Descriptions.Item label={formatMessage({ id: 'yeeorder.buyer' })}>
              {companyName || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'yeeorder.contact' })}>
              {companyContact || '--'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Skeleton>
  );
};

export default InquiryInfo;
