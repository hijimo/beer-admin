import { Avatar, Card, List, Popover, Icon, Modal, Descriptions, message, Typography } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import config from '@common/config';
import { deleteFavoriteBuyer } from '@/services/favorites';
import BuyerSearchForm from './SearchForm';
import styles from '../style.less';

const { mallHost } = config;
const { Paragraph } = Typography;
const ListContent = ({
  data: item,
  data: { companyNameEng, country, sourcingFieldNames },
  handleClick,
}) => (
  <div className='listContent'>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 onClick={() => handleClick(item)}>{companyNameEng}</h3>
      <Descriptions column={4}>
        <Descriptions.Item span={4} label={formatMessage({ id: 'favorites.buyer.country' })}>
          {country || '--'}
        </Descriptions.Item>
        <Descriptions.Item span={4} label={formatMessage({ id: 'favorites.buyer.sourcingfields' })}>
          {sourcingFieldNames ? (
            <Popover
              content={
                <p style={{ maxWidth: 500, wordBreak: 'break-word' }}>{sourcingFieldNames}</p>
              }
              trigger='hover'
            >
              <Paragraph ellipsis={{ rows: 2 }}>{sourcingFieldNames}</Paragraph>
            </Popover>
          ) : (
            '--'
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  </div>
);

@connect(({ favorite, loading }) => ({
  buyers: favorite.buyers,
  tableLoading: loading.effects['favorite/fetchBuyers'],
}))
class FavoriteBuyer extends Component {
  state = {
    searchParams: {},
  };

  componentDidMount() {
    this.fetchBuyersMethod();
  }

  fetchBuyersMethod = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch } = this.props;
    const {
      searchParams: { buyerName, category, country },
    } = this.state;
    const firstCategoryId = category && category[0];
    const secondCategoryId = category && category[1];
    const thirdCategoryId = category && category[2];
    const params = {
      buyerName,
      firstCategoryId,
      secondCategoryId,
      thirdCategoryId,
      country,
      ...pageInfo,
    };
    dispatch({
      type: 'favorite/fetchBuyers',
      payload: params,
    });
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchBuyersMethod();
      },
    );
  };

  showDeleteCofirm = item => {
    const that = this;
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Delete' })}`,
      content: `${formatMessage({ id: 'favorites.buyer.delete-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      okType: 'danger',
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        that.handleDelete(item);
      },
    });
  };

  handleDelete = ({ companyNo }) => {
    deleteFavoriteBuyer({ companyNo }).then(({ success }) => {
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        this.fetchBuyersMethod();
      }
    });
  };

  onPageChange = (current, pageSize) => {
    this.fetchBuyersMethod({
      pageNo: current,
      pageSize,
    });
  };

  handleClick = ({ companyNo }) => {
    window.open(`${mallHost}/companies/${companyNo}/home`, '_blank');
  };

  render() {
    const { tableLoading, buyers } = this.props;
    const { total } = buyers.pagination;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      ...buyers.pagination,
    };
    return (
      <Card bordered={false}>
        <BuyerSearchForm handleSearch={this.handleSearch} />
        <List
          size='large'
          rowKey='id'
          loading={tableLoading}
          pagination={total ? pagination : null}
          dataSource={buyers.list}
          renderItem={item => (
            <List.Item
              className={styles.OnShelves}
              actions={[
                <a
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showDeleteCofirm(item);
                  }}
                >
                  <Icon type='delete' />
                </a>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    onClick={() => this.handleClick(item)}
                    src={item.companyPhoto[0]}
                    shape='square'
                    size='large'
                    style={{ width: 100, height: 100 }}
                  />
                }
              />
              <ListContent data={item} handleClick={this.handleClick} />
            </List.Item>
          )}
        />
      </Card>
    );
  }
}

export default FavoriteBuyer;
