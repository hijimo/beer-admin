import { Avatar, Card, List, Icon, Popover, Typography, Descriptions, Modal, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import _isArray from 'lodash/isArray';
import { formatMessage } from 'umi-plugin-react/locale';
import config from '@common/config';
import { deleteFavoritePro } from '@/services/favorites';
import ProductSearchForm from './SearchForm';
import styles from '../style.less';

const { mallHost } = config;
const { Paragraph } = Typography;
const SaleStatus = {
  OnShelves: 1,
  OffShelves: 0,
};
const ListContent = ({
  data: item,
  data: { name, categoryNamePath, description, companyName, saleStatus },
  handleClick,
}) => (
  <div className='listContent'>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 onClick={() => handleClick(item)}>{name}</h3>
      <Descriptions column={4}>
        <Descriptions.Item span={4} label={formatMessage({ id: 'favorites.products.category' })}>
          {_isArray(categoryNamePath) && !!categoryNamePath.length ? (
            <Popover
              content={
                <p style={{ maxWidth: 500, wordBreak: 'break-word' }}>
                  {categoryNamePath.join(' > ')}
                </p>
              }
              trigger='hover'
            >
              <Paragraph ellipsis={{ rows: 2 }}>{categoryNamePath.join(' > ')}</Paragraph>
            </Popover>
          ) : (
            '--'
          )}
        </Descriptions.Item>
        <Descriptions.Item
          span={4}
          label={formatMessage({ id: 'favorites.products.product-description' })}
        >
          {description ? (
            <Popover
              content={<p style={{ maxWidth: 500, wordBreak: 'break-word' }}>{description}</p>}
              trigger='hover'
            >
              <Paragraph ellipsis={{ rows: 2 }}>{description}</Paragraph>
            </Popover>
          ) : (
            '--'
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
    <div className='listSupplier'>
      <Paragraph ellipsis={{ rows: 2 }}>{companyName}</Paragraph>
    </div>
    {saleStatus === SaleStatus.OffShelves && <div className={styles.offShelvesContent}></div>}
  </div>
);

@connect(({ favorite, loading }) => ({
  products: favorite.products,
  tableLoading: loading.effects['favorite/fetchProducts'],
}))
class FavoriteProducts extends Component {
  state = {
    searchParams: {},
  };

  componentDidMount() {
    this.fetchProductsMethod();
  }

  fetchProductsMethod = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch } = this.props;
    const {
      searchParams: { name, category },
    } = this.state;
    const firstCategoryId = category && category[0];
    const secondCategoryId = category && category[1];
    const thirdCategoryId = category && category[2];
    const params = Object.assign(
      {},
      {
        name,
        firstCategoryId,
        secondCategoryId,
        thirdCategoryId,
        ...pageInfo,
      },
    );
    dispatch({
      type: 'favorite/fetchProducts',
      payload: params,
    });
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchProductsMethod();
      },
    );
  };

  handleClick = ({ spuNo, saleStatus, standardType }) => {
    if (saleStatus === SaleStatus.OffShelves) return;
    window.open(`${mallHost}/products/${spuNo}?standardType=${standardType}`, '_blank');
  };

  showDeleteCofirm = item => {
    const that = this;
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Delete' })}`,
      content: `${formatMessage({ id: 'favorites.products.delete-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      okType: 'danger',
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        that.handleDelete(item);
      },
    });
  };

  handleDelete = ({ id }) => {
    deleteFavoritePro({ productSpuIdList: [id] }).then(({ success }) => {
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        this.fetchProductsMethod();
      }
    });
  };

  onPageChange = (current, pageSize) => {
    this.fetchProductsMethod({
      pageNo: current,
      pageSize,
    });
  };

  render() {
    const { tableLoading, products } = this.props;
    const { total } = products.pagination;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      ...products.pagination,
    };
    return (
      <Card bordered={false}>
        <ProductSearchForm handleSearch={this.handleSearch} />
        <List
          size='large'
          rowKey='id'
          loading={tableLoading}
          pagination={total ? pagination : null}
          dataSource={products.list}
          renderItem={item => (
            <List.Item
              className={
                item.saleStatus === SaleStatus.OnShelves ? styles.OnShelves : styles.OffShelves
              }
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
                    src={item.picture.url}
                    shape='square'
                    size='large'
                    style={{ width: 100, height: 100 }}
                  />
                }
              />
              {item.saleStatus === SaleStatus.OffShelves && (
                <div className={styles.offShelvesAvatar}>Off-Shelves</div>
              )}
              <ListContent data={item} handleClick={this.handleClick} />
            </List.Item>
          )}
        />
      </Card>
    );
  }
}

export default FavoriteProducts;
