import React, { PureComponent } from 'react';
import { Card, Form, Typography, Badge, Tooltip } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import _get from 'lodash/get';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import GeneralTable from '@common/components/GeneralTable';
import ProductListForm from './components/ProductListForm';
import { AuditingStatus, colorsMap } from '../myProduct/enum';

const { Paragraph } = Typography;

@connect(({ product, loading }) => ({
  productList: product.productList,
  tableLoading: loading.effects['product/fetchProductList'],
}))
class CategoryGroup extends PureComponent {
  state = {
    searchParams: {},
  };

  componentDidMount() {
    this.fetchData();
  }

  changePage = ({ current: pageNo, pageSize }) => this.fetchData({ pageNo, pageSize });

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchData();
      },
    );
  };

  fetchData = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch } = this.props;
    const groupId = _get(this.props, 'match.params.groupId');
    const { searchParams } = this.state;
    const params = {
      compStatus: -1,
      groupIdList: [groupId],
      ...pageInfo,
      ...searchParams,
    };
    dispatch({
      type: 'product/fetchProductList',
      payload: params,
    });
  };

  render() {
    const { productList, tableLoading } = this.props;
    const { current, pageSize } = productList.pagination;
    const columns = [
      {
        className: 'nowrap',
        width: 10,
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        fixed: 'left',
        render: (text, record, index) => `${(current - 1) * pageSize + (index + 1)}`,
        key: 'index',
      },
      {
        title: formatMessage({ id: 'product-list.product-No' }),
        dataIndex: 'spuNo',
      },
      {
        title: formatMessage({ id: 'product-list.product-Name' }),
        dataIndex: 'name',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'product-list.category' }),
        dataIndex: 'categoryNamePath',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val && val.join(' > ')}>
            <Paragraph ellipsis={{ rows: 2 }}>{val ? val.join(' > ') : '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'product-list.group' }),
        dataIndex: 'groupNamePaths',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val && val.map(t => t.join(' > ')).join(', ')}>
            <Paragraph ellipsis={{ rows: 2 }}>
              {val ? val.map(t => t.join(' > ')).join(', ') : '--'}
            </Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'product-list.status' }),
        dataIndex: 'saleStatusText',
        render: (val, record) => (
          <div>
            <Badge color={colorsMap[record.checkStatus]} text={record.checkStatusText} />
            {record.checkStatus === AuditingStatus.Success && (
              <div style={{ marginLeft: 15 }}>{val}</div>
            )}
          </div>
        ),
      },
      {
        className: 'nowrap',
        title: formatMessage({ id: 'product-list.action' }),
        width: 10,
        fixed: 'right',
        render(row) {
          return (
            <Link to={`/product/MyProduct/${row.id}/detail`}>
              {formatMessage({ id: 'yeeorder.Details' })}
            </Link>
          );
        },
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card>
          <ProductListForm handleSearch={this.handleSearch} />
          <GeneralTable
            loading={tableLoading}
            rowKey='id'
            scroll={{ x: true }}
            columns={columns}
            dataSource={productList.list}
            pagination={productList.pagination}
            onChange={this.changePage}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(CategoryGroup);
