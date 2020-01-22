import React, { useState, useEffect } from 'react';
import { Card, message, Typography, Tooltip, Button, Row, Modal, Badge } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import UserSearch from './components/UserSearch';
import AddOrEditUser from './components/AddOrEditUser';
import { deleteUserById, putResetPwd } from '@/services/user';

const userStatusMap = {
  1: 'success',
  2: 'default',
};
const { Paragraph } = Typography;
const UserManage = props => {
  const [commonParams, setCommonParams] = useState(null);
  const [currId, setCurrId] = useState(undefined);
  const [currItem, setCurrItem] = useState(undefined)
  const [visible, setVisible] = useState(false);

  /**
   * 请求获取列表数据
   */
  const getDataList = (pagination = null) => {
    props.dispatch({
      type: 'user/getDataList',
      payload: {
        pageNum: pagination && pagination.current ? pagination.current : props.pagination.current,
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


  console.log('pagination:',props.pagination)
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
        deleteUserById(record.userId).then(res => {
          
            message.success(formatMessage({ id: 'yeeorder.success' }));
            if (props.data.length === 0 && props.pagination.current > 1) {
              getDataList({ current: props.pagination.current - 1 });
            } else {
              getDataList();
            }
          
        });
      },
    });
  };

  /**
   * 新增 / 编辑
   */
  const addOrEditItem = record => {
    setCurrId(record ? record.userId : null);
    setCurrItem(record ? JSON.parse(JSON.stringify(record)): undefined)
    setVisible(true);
  };

  /**
   * 隐藏modal
   */
  const hideModal = () => {
    setCurrId(undefined);
    setCurrItem(undefined)
    setVisible(false);
  };



  /**
   * 重置密码
   */
    const resetPwd = record => {
    Modal.confirm({
      title: formatMessage({ id: 'page.user.label.resetPwd.user' }),
      content: formatMessage({ id: 'page.user.label.sureResetPwd.user' }),
      okText: formatMessage({ id: 'yeeorder.Confirm' }),
      cancelText: formatMessage({ id: 'yeeorder.Cancel' }),
      okType: 'danger',
      onOk: () => {
        putResetPwd({ usernames: record.username }).then(res => {
            message.success('成功重置为默认密码:123456');
            getDataList();
          
        });

      },
    });
  }; 

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
      dataIndex: 'userId',
      fixed: 'left',
      width: 10,
    },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'page.user.table.label.userName' }),
      dataIndex: 'username',
    },
    // {
    //   className: 'nowrap',
    //   title: formatMessage({ id: 'page.user.table.label.userEmail' }),
    //   dataIndex: 'userEmail',
    // },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'page.user.table.label.userMobile' }),
      dataIndex: 'mobile',
    },
    {
      title: formatMessage({ id: 'page.user.table.label.userRoleItems' }),
      dataIndex: 'roleName',
      width: 300,
      
    },

    {
      className: 'nowrap',
      title: formatMessage({ id: 'components.table.column.action' }),
      key: 'action',
      width: 10,
      fixed: 'right',
      render: (text, record) => {
        const btnList = [
          <a onClick={() => addOrEditItem(record)}>
            {formatMessage({ id: 'components.table.action.edit' })}
          </a>,
          <a onClick={() => deleteItem(record)}>
            {formatMessage({ id: 'components.table.action.delete' })}
          </a>,
          
          <a onClick={() => resetPwd(record)}>
            {formatMessage({ id: 'components.table.action.resetPwd' })}
          </a>
        ];
        const shouBtnList = {
          1: [btnList[0], btnList[1], btnList[3]],
          2: [btnList[0], btnList[1], btnList[2]],
        };
        return <ActionList actions={btnList} />;
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
          rowKey='userId'
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
          currItem={currItem}
          hideModal={hideModal}
          getDataList={getDataList}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ user, loading }) => ({
  data: user.data,
  pagination: user.pagination,
  loading: loading.effects['user/getDataList'],
});

export default connect(mapStateToProps)(UserManage);
