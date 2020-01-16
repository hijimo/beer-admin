import {
  Avatar,
  Skeleton,
  Descriptions,
  Card,
  Divider,
  Typography,
  Pagination,
  Empty,
  Button,
} from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { router } from 'umi';
import DateIn18 from '@common/components/DateIn18';
import ReceivedSearchForm from './ReceivedSearchForm';
import { ReceivedKeys, RfqStatus, QutoesStatus } from '../../enum';
import { checkRfqFlag } from '@/services/rfq';
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
  RemainTime,
  QuoteSeats,
} = ReceivedKeys;

@connect(({ loading, rfq }) => ({
  rfqRecevied: rfq.rfqRecevied,
  pageLoading: loading.effects['rfq/fetchRfqRecevied'],
}))
class RFQReceived extends Component {
  state = {
    searchParams: {},
  };

  componentDidMount() {
    this.fetchRfqReceviedMethod();
  }

  fetchRfqReceviedMethod = (
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
      type: 'rfq/fetchRfqRecevied',
      payload: params,
    });
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchRfqReceviedMethod();
      },
    );
  };

  handleQuote = ({ inquiryNo, thirdCategoryId }) => {
    checkRfqFlag({ inquiryNo }).then(({ success }) => {
      if (success) {
        router.push({
          pathname: `/rfq/${inquiryNo}/quote`,
          query: {
            thirdCategoryId,
          },
        });
      } else {
        this.fetchRfqReceviedMethod();
      }
    });
  };

  handlePageChange = (pageNo, pageSize) => this.fetchRfqReceviedMethod({ pageNo, pageSize });

  render() {
    const { rfqRecevied, pageLoading } = this.props;
    const { current = 1, pageSize = 10, total = 0 } = rfqRecevied.pagination;
    return (
      <div className='rfqReceived'>
        <ReceivedSearchForm handleSearch={this.handleSearch} />
        <Skeleton paragraph loading={pageLoading}>
          {rfqRecevied.list.map(item => (
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
                  <div style={{ width: '30%', textAlign: 'right' }}>
                    {(item.inquiryStatus === RfqStatus.Canceled ||
                      item.inquiryStatus === RfqStatus.Completed) && (
                      <a style={{ padding: '0 15px' }}>{item.inquiryStatusText || '--'}</a>
                    )}
                    {(item.inquiryStatus === RfqStatus.Pass ||
                      item.inquiryStatus === RfqStatus.Offering) && (
                      <>
                        <a style={{ padding: '0 15px' }}>{item[RemainTime.key] || '--'}</a>
                        <a style={{ padding: '0 15px' }}>{item[QuoteSeats.key] || '--'}</a>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.rfqItem}>
                  <div className={styles.rfqItemAvatar}>
                    <Avatar shape='square' size={80} src={item[ProductPic.key]} />
                  </div>
                  <div className={styles.rfqItemContent}>
                    <div style={{ width: '70%' }}>
                      <Descriptions>
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
                    <div style={{ width: '30%', textAlign: 'right' }}>
                      <Link to={`/rfq/${item.id}/detail?qutoesStatus=${QutoesStatus.UnQutoed}`}>
                        {formatMessage({ id: 'yeeorder.Details' })}
                      </Link>
                      <Button
                        disabled={[RfqStatus.Canceled, RfqStatus.Completed].includes(
                          item.inquiryStatus,
                        )}
                        type='link'
                        onClick={() => this.handleQuote(item)}
                      >
                        {formatMessage({ id: 'rfq.received.quote-now' })}
                      </Button>
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
      </div>
    );
  }
}

export default RFQReceived;
