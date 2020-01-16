import { Typography, Tooltip } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import GeneralTable from '@common/components/GeneralTable';

const { Paragraph } = Typography;

class ProductList extends Component {
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
  };

  render() {
    const { data, expoGoodsIds = [], pageconf, selectedRows = [], loading } = this.props;
    const { current, pageSize } = pageconf;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(({ id }) => id),
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: expoGoodsIds.includes(record.id),
      }),
    };
    const columns = [
      {
        className: 'nowrap',
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        fixed: 'left',
        render: (text, record, index) => `${(current - 1) * pageSize + (index + 1)}`,
        width: 10,
        key: 'index',
      },
      {
        title: formatMessage({ id: 'expo-products.product-No' }),
        dataIndex: 'spuNo',
      },
      {
        title: formatMessage({ id: 'expo-products.product-name' }),
        dataIndex: 'name',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'expo-products.category' }),
        dataIndex: 'categoryNamePath',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
    ];
    return (
      <GeneralTable
        rowKey='id'
        loading={loading}
        columns={columns}
        rowSelection={rowSelection}
        dataSource={data}
        pagination={pageconf}
        scroll={{ x: true }}
        onChange={this.props.changePage}
      />
    );
  }
}

export default ProductList;
