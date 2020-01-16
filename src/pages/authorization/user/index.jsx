import React, { useState, useEffect } from 'react';
import { Card, message, Typography, Tooltip, Button, Row, Modal, Badge } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import UserSearch from './components/UserSearch';
import AddOrEditUser from './components/AddOrEditUser';
import { deleteUser, updateUserStatus } from '@/services/userManage';

const userStatusMap = {
  1: 'success',
  2: 'default',
};
const { Paragraph } = Typography;
const UserManage = props => {
  const [commonParams, setCommonParams] = useState(null);
  const [currId, setCurrId] = useState(undefined);
  const [visible, setVisible] = useState(false);

  /**
   * 请求获取列表数据
   */
  const getDataList = (pagination = null) => {
    props.dispatch({
      type: 'authUser/getDataList',
      payload: {
        pageNo: pagination && pagination.current ? pagination.current : props.pagination.current,
        pageSize:
          pagination && pagination.pageSize ? pagination.pageSize : props.pagination.pageSize,
        opType: 1,
        ...commonParams,
      },
    });
  };

  useEffect(() => {
    getDataList({ current: 1, pageSize: props.pagination.pageSize || 10 });
  }, [commonParams]);

  /**
   * 搜索
   */
  const searchParamsChange = (params = null) => {
    setCommonParams(params);
  };

  /**
   * 表格page,pageSize改变，拉取数据
   */
  const tableChange = pagination => {
    getDataList(pagination);
  };

  /**
   * 删除用户
   */
  const deleteItem = record => {
    Modal.confirm({
      title: formatMessage({ id: 'page.user.label.delete.user' }),
      content: formatMessage({ id: 'page.user.label.sureDelete.user' }),
      okText: formatMessage({ id: 'yeeorder.Confirm' }),
      cancelText: formatMessage({ id: 'yeeorder.Cancel' }),
      okType: 'danger',
      onOk: () => {
        deleteUser({ userNo: record.userNo }).then(res => {
          if (res.success) {
            message.success(formatMessage({ id: 'yeeorder.success' }));
            if (props.data.length === 0 && props.pagination.current > 1) {
              getDataList({ current: props.pagination.current - 1 });
            } else {
              getDataList();
            }
          }
        });
      },
    });
  };

  /**
   * 新增 / 编辑
   */
  const addOrEditItem = id => {
    setCurrId(id);
    setVisible(true);
  };

  /**
   * 隐藏modal
   */
  const hideModal = () => {
    setCurrId(undefined);
    setVisible(false);
  };

  /**
   * 启用 / 禁用
   */
  const changeStatus = (flag, record) => {
    Modal.confirm({
      title: flag
        ? formatMessage({ id: 'page.user.label.enable.user' })
        : formatMessage({ id: 'page.user.label.unEnable.user' }),
      content: flag
        ? formatMessage({ id: 'page.user.label.sureEnable.user' })
        : formatMessage({ id: 'page.user.label.sureUnEnable.user' }),
      okText: formatMessage({ id: 'yeeorder.Confirm' }),
      cancelText: formatMessage({ id: 'yeeorder.Cancel' }),
      okType: 'danger',
      onOk: () => {
        updateUserStatus({ userNo: record.userNo }).then(res => {
          if (res.success) {
            message.success(formatMessage({ id: 'yeeorder.success' }));
            getDataList();
          }
        });
      },
    });
  };

  /**
   * 重置密码
   */
  /*  const resetPwd = record => {
    Modal.confirm({
      title: formatMessage({ id: 'page.user.label.resetPwd.user' }),
      content: formatMessage({ id: 'page.user.label.sureResetPwd.user' }),
      okText: formatMessage({ id: 'yeeorder.Confirm' }),
      cancelText: formatMessage({ id: 'yeeorder.Cancel' }),
      okType: 'danger',
      onOk: () => {
        updateUserStatus({ userNo: record.userNo }).then(res => {
          if (res.success) {
            message.success(formatMessage({ id: 'yeeorder.success' }));
            getDataList();
          }
        });

      },
    });
  }; */

  const columns = [
    {
      className: 'nowrap',
      title: formatMessage({ id: 'components.table.colums.index' }),
      key: 'index',
      width: 10,
      align: 'center',
      fixed: 'left',
      render: (text, record, index) =>
        `${(props.pagination.current - 1) * props.pagination.pageSize + index + 1}`,
    },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'page.user.table.label.userNo' }),
      dataIndex: 'userNo',
      fixed: 'left',
      width: 10,
    },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'page.user.table.label.userName' }),
      dataIndex: 'userName',
    },
    // {
    //   className: 'nowrap',
    //   title: formatMessage({ id: 'page.user.table.label.userEmail' }),
    //   dataIndex: 'userEmail',
    // },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'page.user.table.label.userMobile' }),
      dataIndex: 'userMobile',
    },
    {
      title: formatMessage({ id: 'page.user.table.label.userRoleItems' }),
      dataIndex: 'roleInfoItem',
      width: 300,
      render: val => {
        if (val && val.length) {
          const arr = val.map(item => item.roleName);
          const text = arr.join('、');
          return (
            <Tooltip placement='topLeft' title={text}>
              <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
            </Tooltip>
          );
        }
        return '--';
      },
    },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'page.user.table.label.userStatus' }),
      dataIndex: 'userStatusText',
      render: (val, record) => {
        const status = userStatusMap[record.userStatus] || '';
        return <Badge status={status} text={val} />;
      },
    },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'components.table.column.action' }),
      key: 'action',
      width: 10,
      fixed: 'right',
      render: (text, record) => {
        const btnList = [
          <a onClick={() => addOrEditItem(record.userNo)}>
            {formatMessage({ id: 'components.table.action.edit' })}
          </a>,
          <a onClick={() => deleteItem(record)}>
            {formatMessage({ id: 'components.table.action.delete' })}
          </a>,
          <a onClick={() => changeStatus(true, record)}>
            {formatMessage({ id: 'components.table.action.enable' })}
          </a>,
          <a onClick={() => changeStatus(false, record)}>
            {formatMessage({ id: 'components.table.action.unEnable' })}
          </a>,
          // <a onClick={() => resetPwd(record)}>
          //   {formatMessage({ id: 'components.table.action.resetPwd' })}
          // </a>
        ];
        const shouBtnList = {
          1: [btnList[0], btnList[1], btnList[3]],
          2: [btnList[0], btnList[1], btnList[2]],
        };
        return <ActionList actions={shouBtnList[record.userStatus]} />;
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card>
        <UserSearch searchParamsChange={searchParamsChange} />
        <Row className='mb10'>
          <Button type='primary' onClick={() => addOrEditItem(null)}>
            {formatMessage({ id: 'page.user.btn.add.user' })}
          </Button>
        </Row>
        <GeneralTable
          rowKey='userNo'
          scroll={{ x: true }}
          loading={props.loading}
          dataSource={props.data}
          pagination={props.pagination}
          columns={columns}
          onChange={tableChange}
        />
        <AddOrEditUser
          visible={visible}
          currId={currId}
          hideModal={hideModal}
          getDataList={getDataList}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ authUser, loading }) => ({
  data: authUser.data,
  pagination: authUser.pagination,
  loading: loading.effects['authUser/getDataList'],
});

export default connect(mapStateToProps)(UserManage);
