import { Form, Typography, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import GeneralTable from '@common/components/GeneralTable';
import ProductSearchForm from './ProductSearchForm';
import { ProductKeys } from './enum';

const { Paragraph } = Typography;
const { ProductName, Group, Price, UOM } = ProductKeys;

@connect(({ rfq, loading }) => ({
  product: rfq.product,
  pageLoading: loading.effects['rfq/fetchProduct'],
}))
class ChooseProduct extends Component {
  state = {
    searchParams: {},
    selectedRowKeys: [],
  };

  componentDidMount() {
    this.fetchProductMethod();
  }

  fetchProductMethod = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch, thirdCategoryId } = this.props;
    const { searchParams } = this.state;
    const params = {
      ...searchParams,
      ...pageInfo,
      compStatus: 1, // 查询已上架的商品
      needExtraInfo: true,
      thirdCategoryId,
    };
    dispatch({
      type: 'rfq/fetchProduct',
      payload: params,
    }).then(() => this.onSelectChange([]));
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchProductMethod();
      },
    );
  };

  handlePageChange = ({ current, pageSize }) =>
    this.fetchProductMethod({ pageNo: current, pageSize });

  onSelectChange = selectedRows => {
    const { onSelect } = this.props;
    this.setState(
      {
        selectedRowKeys: selectedRows.map(({ id }) => id),
      },
      () => {
        onSelect(selectedRows);
      },
    );
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { pageLoading, product } = this.props;
    const { current, pageSize } = product.pagination;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: (_, selectedRows) => {
        this.onSelectChange(selectedRows || []);
      },
    };
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
        title: formatMessage({ id: ProductName.label }),
        dataIndex: ProductName.key,
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || ''}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: Group.label }),
        dataIndex: Group.key,
        width: 200,
        render: val => {
          const content = (val || []).map(t => t.join('>')).join(', ');
          return (
            <Tooltip placement='topLeft' title={content}>
              <Paragraph ellipsis={{ rows: 2 }}>{content}</Paragraph>
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: Price.label }),
        dataIndex: 'priceText',
      },
      {
        title: formatMessage({ id: UOM.label }),
        dataIndex: `${UOM.key}Text`,
      },
    ];
    return (
      <>
        <ProductSearchForm handleSearch={this.handleSearch} />
        <GeneralTable
          rowKey='id'
          loading={pageLoading}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={product.list}
          pagination={product.pagination}
          scroll={{ x: true }}
          onChange={this.handlePageChange}
        />
      </>
    );
  }
}

export default Form.create()(ChooseProduct);
