import { Avatar, Alert, Badge, Typography, Tooltip } from 'antd';
import React, { Component, Fragment } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import { router } from 'umi';
import styles from '../../style.less';

const { Paragraph } = Typography;
const statusMap = ['processing', 'success', 'default'];

class StandardTable extends Component {
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const currySelectedRowKeys = selectedRowKeys;
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    this.setState({
      selectedRowKeys: currySelectedRowKeys,
    });
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  showDetails = ({ edGoodsId }) => {
    router.push(`/product/MyProduct/${edGoodsId}/detail`);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { data, pageconf, loading } = this.props;
    const { current, pageSize } = pageconf;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const columns = [
      {
        className: 'nowrap',
        width: 10,
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        fixed: 'left',
        render: (text, record, index) => `${(current - 1) * pageSize + (index + 1)}`,
      },
      {
        className: 'nowrap',
        title: formatMessage({ id: 'expo-products.list.product' }),
        dataIndex: 'edGoodsMainPic',
        render: val => <Avatar shape='square' size={80} src={val} alt='error' />,
        fixed: 'left',
        width: 10,
      },
      {
        width: 300,
        dataIndex: 'edGoodsName',
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'expo-products.list.expo' }),
        dataIndex: 'expoName',
        width: 300,
        render(val, record) {
          const { expoName, startDate, endDate } = record;
          return (
            <Fragment>
              <Tooltip placement='topLeft' title={expoName}>
                <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: '1em' }}>
                  {expoName || '--'}
                </Paragraph>
              </Tooltip>
              <p style={{ marginTop: '1em', marginBottom: 0 }}>
                <DateIn18 date={startDate} /> - <DateIn18 date={endDate} />
              </p>
            </Fragment>
          );
        },
      },
      {
        title: formatMessage({ id: 'expo-products.list.update-date' }),
        dataIndex: 'gmtUpdate',
        render: val => <DateIn18 date={val} />,
      },
      {
        title: formatMessage({ id: 'expo-products.list.status' }),
        dataIndex: 'edAuditStatus',
        render: (val, { edAuditStatusText }) => (
          <Badge status={statusMap[val]} text={edAuditStatusText} />
        ),
      },
      {
        className: 'nowrap',
        width: 10,
        title: formatMessage({ id: 'expo-products.list.action' }),
        fixed: 'right',
        render: row => (
          <ActionList
            actions={[
              <a onClick={() => this.showDetails(row)}>
                {formatMessage({ id: 'yeeorder.Details' })}
              </a>,
            ]}
          />
        ),
      },
    ];
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                <FormattedMessage id='yeeorder.select' defaultMessage='Select' />{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>
                &nbsp;{formatMessage({ id: 'yeeorder.items' })}&nbsp;&nbsp;
                {selectedRowKeys.length ? (
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    <FormattedMessage id='yeeorder.clear' defaultMessage='Clear' />
                  </a>
                ) : (
                  ''
                )}
              </Fragment>
            }
            type='info'
            showIcon
          />
        </div>
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
      </div>
    );
  }
}

export default StandardTable;
