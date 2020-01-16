import { Avatar, Card, Descriptions, Divider, Skeleton, Typography, Empty } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import DateIn18 from '@common/components/DateIn18';
import Link from 'umi/link';
import { QuoteKeys, QutoesStatus } from '@/pages/RFQ/enum';
import styles from '../style.less';

const { Paragraph } = Typography;
const {
  RFQNO,
  RFQResealeDate,
  ValidTo,
  ProductPic,
  ProductName,
  Category,
  Quantity,
  PurchaseName,
} = QuoteKeys;

const LatestRFQ = ({ latestRFQ }) => {
  const rfqList = latestRFQ.map(item => (
    <Card.Grid key={item.id} style={{ width: '100%', paddingTop: 12 }}>
      <Card bodyStyle={{ padding: 0 }} bordered={false}>
        <div className={styles.rfqTitle}>
          <Descriptions>
            <Descriptions.Item label={formatMessage({ id: RFQNO.label })}>
              {item[RFQNO.key] || '--'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: RFQResealeDate.label })}>
              {item[RFQResealeDate.key] ? (
                <DateIn18 date={item[RFQResealeDate.key]} fullTime />
              ) : (
                '--'
              )}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: ValidTo.label })}>
              {item[ValidTo.key] ? <DateIn18 date={item[ValidTo.key]} /> : '--'}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div className={styles.rfqItemTitle}>
          <h4 style={{ width: '60%' }}>{item[ProductName.key] || '--'}</h4>
        </div>
        <div className={styles.rfqItem}>
          <div className={styles.rfqItemAvatar}>
            <Avatar shape='square' size={80} src={item[ProductPic.key]} />
          </div>
          <div className={styles.rfqItemContent}>
            <div style={{ width: '60%' }}>
              <Descriptions column={3}>
                <Descriptions.Item
                  label={formatMessage({ id: Category.label })}
                  className={styles.rfqItemCategory}
                  span={2}
                >
                  <Paragraph ellipsis={{ rows: 2 }}>{item[Category.key] || '--'}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({ id: Quantity.label })}
                  className={styles.rfqItemQuantity}
                >
                  {item.productQuantityText || '--'} {item.productQuantityUnitText || '--'}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions>
                <Descriptions.Item>
                  <Paragraph ellipsis={{ rows: 2 }}>{item[PurchaseName.key] || '--'}</Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div style={{ width: '20%', textAlign: 'center' }}>
              {<p style={{ marginBottom: 0 }}>{formatMessage({ id: 'rfq.detail.quote' })}</p>}
            </div>
            <div style={{ width: '20%', textAlign: 'right' }}>
              <Link to={`/rfq/${item.id}/detail?qutoesStatus=${QutoesStatus.HasQutoed}`}>
                {formatMessage({ id: 'yeeorder.Details' })}
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </Card.Grid>
  ));
  return (
    <Card
      title={formatMessage({ id: 'home.Latest-RFQ' })}
      bordered={false}
      extra={<Link to='/rfq'>{formatMessage({ id: 'yeeorder.More' })}</Link>}
      style={{ marginTop: '24px' }}
    >
      <Skeleton paragraph loading={!latestRFQ}>
        {latestRFQ && !!latestRFQ.length ? rfqList : <Empty />}
      </Skeleton>
    </Card>
  );
};

export default LatestRFQ;
