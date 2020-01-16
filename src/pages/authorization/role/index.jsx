import React, { useState, useEffect } from 'react';
import { Card, message, Typography, Tooltip, Button, Row, Modal, Badge } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import Search from './components/Search';
import AddOrEdit from './components/AddOrEdit';
import { deleteRole, updateStatus } from '@/services/roleManage';

const roleStatusMap = {
  0: 'success',
  1: 'default',
};
const { Paragraph } = Typography;
const RoleManage = props => {
  const [commonParams, setCommonParams] = useState(null);
  const [currId, setCurrId] = useState(undefined);
  const [visible, setVisible] = useState(false);

  /**
   * 请求获取列表数据
   */
  const getDataList = (pagination = null) => {
    props.dispatch({
      type: 'role/getDataList',
      payload: {
        pageNo: pagination && pagination.current ? pagination.current : props.pagination.current,
        pageSize:
          pagination && pagination.pageSize ? pagination.pageSize : props.pagination.pageSize,
        freeze: true,
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
   * 删除
   */
  const deleteItem = record => {
    Modal.confirm({
      title: formatMessage({ id: 'page.role.label.delete.role' }),
      content: formatMessage({ id: 'page.role.label.sureDelete.role' }),
      okText: formatMessage({ id: 'yeeorder.Confirm' }),
      cancelText: formatMessage({ id: 'yeeorder.Cancel' }),
      okType: 'danger',
      onOk: () => {
        deleteRole({ roleNo: record.roleNo }).then(res => {
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

  const changeStatus = (flag, record) => {
    Modal.confirm({
      title: flag
        ? formatMessage({ id: 'page.role.label.enable.role' })
        : formatMessage({ id: 'page.role.label.unEnable.role' }),
      content: flag
        ? formatMessage({ id: 'page.role.label.sureEnable.role' })
        : formatMessage({ id: 'page.role.label.sureUnEnable.role' }),
      okText: formatMessage({ id: 'yeeorder.Confirm' }),
      cancelText: formatMessage({ id: 'yeeorder.Cancel' }),
      okType: 'danger',
      onOk: () => {
        updateStatus({ roleNo: record.roleNo }).then(res => {
          if (res.success) {
            message.success(formatMessage({ id: 'yeeorder.success' }));
            getDataList();
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
      title: formatMessage({ id: 'page.role.table.label.roleNo' }),
      dataIndex: 'roleNo',
      fixed: 'left',
      width: 10,
    },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'page.role.table.label.roleName' }),
      dataIndex: 'roleName',
    },
    {
      title: formatMessage({ id: 'page.role.table.label.roleDesc' }),
      dataIndex: 'roleDescription',
      width: 300,
      render: val => (
        <Tooltip placement='topLeft' title={val}>
          <Paragraph ellipsis={{ rows: 2, expandable: false }}>{val || '--'}</Paragraph>
        </Tooltip>
      ),
    },
    {
      className: 'nowrap',
      title: formatMessage({ id: 'page.role.table.label.roleStatus' }),
      dataIndex: 'roleStatusText',
      render: (val, record) => {
        const status = roleStatusMap[record.roleStatus] || '';
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
          <a onClick={() => addOrEditItem(record.roleNo)}>
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
        ];
        const shouBtnList = {
          0: [btnList[0], btnList[1], btnList[3]],
          1: [btnList[0], btnList[1], btnList[2]],
        };
        return <ActionList actions={shouBtnList[record.roleStatus]} />;
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card>
        <Search searchParamsChange={searchParamsChange} />
        <Row className='mb10'>
          <Button type='primary' onClick={() => addOrEditItem(undefined)}>
            {formatMessage({ id: 'page.role.btn.add.role' })}
          </Button>
        </Row>
        <GeneralTable
          rowKey='roleNo'
          scroll={{ x: true }}
          loading={props.loading}
          dataSource={props.data}
          pagination={props.pagination}
          columns={columns}
          onChange={tableChange}
        />
        <AddOrEdit
          visible={visible}
          currId={currId}
          hideModal={hideModal}
          getDataList={getDataList}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ role, loading }) => ({
  data: role.data,
  pagination: role.pagination,
  loading: loading.effects['role/getDataList'],
});
export default connect(mapStateToProps)(RoleManage);
