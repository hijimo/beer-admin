import { Avatar, Button, Badge, Form, Popover, Typography, Modal, message, Tooltip } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import { reApplyExpo } from '@/services/expo';
import AppForm from './AppForm';
import ExpoDetail from './ExpoDetail';
import ReApplyModal from './ReApplyModal';
import styles from '../../style.less';

const { Paragraph } = Typography;
const statusMap = ['processing', 'success', 'default'];

@connect(({ expo, loading }) => ({
  applicationData: expo.applicationData,
  tableLoading: loading.effects['expo/fetchApplication'],
  searchParams: expo.appFormValues,
}))
class Application extends Component {
  state = {
    showDetail: false,
    expoDetail: {},
    reApplyModalShow: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'expo/toggleAppForm',
      payload: false,
    });
  }

  fetchData = () => {
    const { dispatch, searchParams } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 10,
      ...searchParams,
    };
    dispatch({
      type: 'expo/fetchApplication',
      payload: params,
    });
  };

  handleSearch = async searchParams => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'expo/setAppFormValues',
      payload: searchParams,
    });
    this.fetchData();
  };

  handlePageChange = pagination => {
    const { dispatch, searchParams } = this.props;
    const params = {
      ...searchParams,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'expo/fetchApplication',
      payload: params,
    });
  };

  showDetails = row => {
    this.setState({
      showDetail: true,
      expoDetail: row,
    });
  };

  handleApply = ({ id }) => {
    const that = this;
    Modal.confirm({
      title: `${formatMessage({ id: 'application.re-apply.title' })}`,
      content: `${formatMessage({ id: 'application.re-apply.content' })}`,
      onOk() {
        reApplyExpo({ id }).then(res => {
          const { success, retMsg } = res;
          if (success) {
            that.fetchData();
          } else {
            message.error(retMsg);
          }
        });
      },
    });
  };

  handleExpoDetailClose = () => {
    this.setState({ showDetail: false });
  };

  handleReapplySubmit = params => {
    reApplyExpo(params).then(({ success }) => {
      if (success) {
        this.handleReapplyClose();
        this.fetchData();
      }
    });
  };

  handleReapplyClose = () => {
    this.setState({ reApplyModalShow: false });
  };

  render() {
    const { showDetail, expoDetail, reApplyModalShow } = this.state;
    const { applicationData, tableLoading, location } = this.props;
    const { current, pageSize } = applicationData.pagination;
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
        className: 'nowrap',
        title: formatMessage({ id: 'application.form.expo' }),
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
        title: formatMessage({ id: 'application.list.expo-location' }),
        dataIndex: 'address',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'application.list.expo-date' }),
        dataIndex: 'expoDate',
        render: (val, { startTime, endTime }) => (
          <>
            <DateIn18 date={startTime} />-
            <DateIn18 date={endTime} />
          </>
        ),
      },
      {
        title: formatMessage({ id: 'application.list.apply-date' }),
        dataIndex: 'applyTime',
        render: val => <DateIn18 date={val} />,
      },
      {
        title: formatMessage({ id: 'application.list.status' }),
        dataIndex: 'auditStatus',
        render: (val, { auditStatusText, auditReason }) => (
          <Badge
            status={statusMap[val]}
            text={
              val === 2 ? (
                <>
                  <span>{auditStatusText}</span>
                  <Popover
                    content={<p style={{ maxWidth: 500, wordBreak: 'break-all' }}>{auditReason}</p>}
                    trigger='hover'
                  >
                    <Button type='link'>{formatMessage({ id: 'yeeorder.Reason' })}</Button>
                  </Popover>
                </>
              ) : (
                auditStatusText
              )
            }
          />
        ),
      },
      {
        className: 'nowrap',
        width: 10,
        title: formatMessage({ id: 'application.list.action' }),
        fixed: 'right',
        render: row => {
          const content =
            row.actStatus === 2 && row.auditStatus !== 1 ? (
              <Badge>{formatMessage({ id: 'application.status.overdue' })}</Badge>
            ) : (
              <ActionList
                actions={[
                  <a onClick={() => this.showDetails(row)}>
                    {formatMessage({ id: 'yeeorder.Details' })}
                  </a>,
                  row.auditStatus === 2 && (
                    <a onClick={() => this.handleApply(row)}>
                      {formatMessage({ id: 'yeeorder.Apply' })}
                    </a>
                  ),
                ]}
              />
            );
          return content;
        },
      },
    ];
    return (
      <div className={styles.tableList}>
        <AppForm handleSearch={this.handleSearch} location={location} />
        <GeneralTable
          rowKey='id'
          loading={tableLoading}
          columns={columns}
          dataSource={applicationData.list}
          pagination={applicationData.pagination}
          scroll={{ x: true }}
          onChange={this.handlePageChange}
        />
        <ExpoDetail
          visible={showDetail}
          detail={expoDetail}
          handleClose={this.handleExpoDetailClose}
        />
        <ReApplyModal
          visible={reApplyModalShow}
          detail={expoDetail}
          handleModalClose={this.handleReapplyClose}
          handleSubmit={this.handleReapplySubmit}
        />
      </div>
    );
  }
}

export default Form.create()(Application);
