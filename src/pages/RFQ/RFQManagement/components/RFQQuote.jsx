import { Avatar, Skeleton, Descriptions, Card, Divider, Typography, Pagination, Empty } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import DateIn18 from '@common/components/DateIn18';
import QuoteSearchForm from './QuoteSearchForm';
import { QuoteKeys, QutoesStatus } from '../../enum';
import styles from '../../style.less';

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
@connect(({ loading, rfq }) => ({
  rfqQuote: rfq.rfqQuote,
  pageLoading: loading.effects['rfq/fetchRfqQuote'],
}))
class RFQQuote extends Component {
  state = {
    searchParams: {},
  };

  componentDidMount() {
    this.fetchRfqQuoteMethod();
  }

  fetchRfqQuoteMethod = (
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
      type: 'rfq/fetchRfqQuote',
      payload: params,
    });
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchRfqQuoteMethod();
      },
    );
  };

  handlePageChange = (pageNo, pageSize) => this.fetchRfqQuoteMethod({ pageNo, pageSize });

  render() {
    const { rfqQuote, pageLoading } = this.props;
    const { current = 1, pageSize = 10, total = 0 } = rfqQuote.pagination;
    return (
      <>
        <QuoteSearchForm handleSearch={this.handleSearch} />
        <Skeleton paragraph loading={pageLoading}>
          {rfqQuote.list.map(item => (
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
                  <h4 style={{ width: '70%' }}>{item[ProductName.key] || '--'}</h4>
                </div>
                <div className={styles.rfqItem}>
                  <div className={styles.rfqItemAvatar}>
                    <Avatar shape='square' size={80} src={item[ProductPic.key]} />
                  </div>
                  <div className={styles.rfqItemContent}>
                    <div style={{ width: '70%' }}>
                      <Descriptions column={3}>
                        <Descriptions.Item
                          label={formatMessage({ id: Category.label })}
                          className={styles.rfqItemCategory}
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
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {item[PurchaseName.key] || '--'}
                          </Paragraph>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                    <div style={{ width: '15%', textAlign: 'center' }}>
                      {
                        <p style={{ marginBottom: 0 }}>
                          {formatMessage({ id: 'rfq.detail.quote' })}
                        </p>
                      }
                    </div>
                    <div style={{ width: '15%', textAlign: 'right' }}>
                      <Link to={`/rfq/${item.id}/detail?qutoesStatus=${QutoesStatus.HasQutoed}`}>
                        {formatMessage({ id: 'yeeorder.Details' })}
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </Card.Grid>
          ))}
        </Skeleton>
        {total === 0 && !pageLoading && (
          <Empty description={formatMessage({ id: 'yeeorder.no-data' })} />
        )}
        {total !== 0 && (
          <Pagination
            style={{
              float: 'right',
              marginTop: 16,
            }}
            onChange={this.handlePageChange}
            onShowSizeChange={this.handlePageChange}
            total={total}
            pageSize={pageSize}
            current={current}
            showSizeChanger
            showQuickJumper
          />
        )}
      </>
    );
  }
}

export default RFQQuote;
