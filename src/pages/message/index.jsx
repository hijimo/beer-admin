import { Card, Typography, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import { deleteMessage, readMessage } from '@/services/message';
import './style.less';

const { Paragraph } = Typography;

const Message = props => {
  const { messageData, tableLoading, dispatch } = props;
  const { current, pageSize, total } = messageData.pagination;

  const fetchMessageMethod = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    dispatch({
      type: 'message/fetchMessage',
      payload: {
        ...pageInfo,
      },
    });
  };

  useEffect(() => {
    fetchMessageMethod();
  }, []);

  const changePage = pagination =>
    fetchMessageMethod({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });

  const handleDelete = (e, { id }) => {
    e.stopPropagation();
    deleteMessage({ id }).then(({ success }) => {
      if (success) {
        if (current === Math.floor(total / pageSize) + 1 && total % pageSize === 1) {
          fetchMessageMethod({
            pageNo: current - 1,
            pageSize,
          });
        } else {
          fetchMessageMethod({
            pageNo: current,
            pageSize,
          });
        }
        if (dispatch) {
          dispatch({
            type: 'common/fetchNotice',
          });
        }
      }
    });
  };

  const handleRead = ({ id, readFlag }) => {
    if (readFlag) return;
    readMessage({ id }).then(({ success }) => {
      if (success) {
        fetchMessageMethod({
          pageNo: current,
          pageSize,
        });
        if (dispatch) {
          dispatch({
            type: 'common/fetchNotice',
          });
        }
      }
    });
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
      title: formatMessage({ id: 'message.message' }),
      dataIndex: 'content',
      width: 400,
      render: val => (
        <Tooltip placement='topLeft' title={val}>
          <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'message.type' }),
      dataIndex: 'sysTypeText',
    },
    {
      title: formatMessage({ id: 'message.time' }),
      dataIndex: 'gmtCreate',
      render: val => <DateIn18 date={val} fullTime />,
    },
    {
      className: 'nowrap',
      width: 10,
      title: formatMessage({ id: 'message.action' }),
      fixed: 'right',
      align: 'center',
      render: (val, row) => (
        <ActionList
          actions={[
            <a onClick={e => handleDelete(e, row)}>{formatMessage({ id: 'yeeorder.Delete' })}</a>,
          ]}
        />
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <GeneralTable
          rowKey='id'
          loading={tableLoading}
          columns={columns}
          dataSource={messageData.list}
          pagination={messageData.pagination}
          scroll={{ x: true }}
          onChange={changePage}
          onRow={record => ({
            onClick: () => {
              handleRead(record);
            },
          })}
          rowClassName={record => (!record.readFlag ? 'noRead' : '')}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ message, loading }) => ({
  messageData: message.messageData,
  tableLoading: loading.effects['message/fetchMessage'],
}))(Message);
