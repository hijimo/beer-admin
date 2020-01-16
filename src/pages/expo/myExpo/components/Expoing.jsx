import { Avatar, Badge, Form, Typography, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import config from '@common/config';
import { formatMessage } from 'umi-plugin-react/locale';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import ExpoForm from './ExpoForm';
import styles from '../../style.less';

const { Paragraph } = Typography;
const { mallHost } = config;
const statusMap = ['processing', 'success', 'default'];

@connect(({ expo, loading }) => ({
  myExpoData: expo.myExpoData,
  tableLoading: loading.effects['expo/fetchApplication'],
}))
class Expoing extends Component {
  state = {
    searchParams: {},
  };

  componentDidMount() {
    this.fetchExpoMethod();
  }

  fetchExpoMethod = () => {
    const { dispatch } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 10,
      ...this.state.searchParams,
    };
    dispatch({
      type: 'expo/fetchExpo',
      payload: params,
    });
  };

  showDetails = row => {
    window.open(`${mallHost}/expo/${row.expoId}`, '_blank');
  };

  showProducts = ({ expoId, title }) => {
    const { dispatch } = this.props;
    const searchParams = {
      expoId,
      expoName: title,
    };
    dispatch({
      type: 'expo/setExpoProFormValues',
      payload: searchParams,
    });
    dispatch({
      type: 'expo/toggleExpoProForm',
      payload: true,
    });
    router.push({ pathname: '/expo/expoProducts' });
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchExpoMethod();
      },
    );
  };

  handlePageChange = pagination => {
    const { dispatch } = this.props;
    const params = {
      ...this.state.searchParams,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'expo/fetchExpo',
      payload: params,
    });
  };

  render() {
    const { myExpoData, tableLoading } = this.props;
    const { current, pageSize } = myExpoData.pagination;
    const columns = [
      {
        className: 'nowrap',
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        fixed: 'left',
        width: 10,
        render: (text, record, index) => `${(current - 1) * pageSize + (index + 1)}`,
        key: 'index',
      },
      {
        className: 'nowrap',
        title: formatMessage({ id: 'my-expo.list.expo' }),
        dataIndex: 'mainPic',
        fixed: 'left',
        width: 10,
        render: val => <Avatar shape='square' size={80} src={val} alt='error' />,
      },
      {
        dataIndex: 'title',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'my-expo.list.expo-location' }),
        dataIndex: 'address',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'my-expo.list.expo-date' }),
        dataIndex: 'expoDate',
        render: (val, { startTime, endTime }) => (
          <>
            <DateIn18 date={startTime} />
            -
            <DateIn18 date={endTime} />
          </>
        ),
      },
      {
        title: formatMessage({ id: 'my-expo.list.status' }),
        dataIndex: 'actStatus',
        render: (val, { actStatusText }) => <Badge status={statusMap[val]} text={actStatusText} />,
      },
      {
        className: 'nowrap',
        title: formatMessage({ id: 'my-expo.list.action' }),
        fixed: 'right',
        width: 10,
        render: row => (
          <ActionList
            actions={[
              <a onClick={() => this.showDetails(row)}>
                {formatMessage({ id: 'yeeorder.Details' })}
              </a>,
              <a onClick={() => this.showProducts(row)}>
                {formatMessage({ id: 'my-expo.expo-products' })}
              </a>,
            ]}
          />
        ),
      },
    ];
    return (
      <div className={styles.tableList}>
        <ExpoForm handleSearch={this.handleSearch} />
        <GeneralTable
          rowKey='id'
          loading={tableLoading}
          columns={columns}
          dataSource={myExpoData.list}
          pagination={myExpoData.pagination}
          scroll={{ x: true }}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default Form.create()(Expoing);
