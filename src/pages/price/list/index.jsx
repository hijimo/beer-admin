import React, { useState, useEffect, useCallback } from 'react';
import { Card, Badge, Tooltip, Typography, Row, Button, Modal, message, Avatar } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import produce from 'immer';
import _get from 'lodash/get';
import { Link } from 'umi';
import ActionList from '@common/components/ActionList';
import GeneralTable from '@common/components/GeneralTable';
import DateIn18 from '@common/components/DateIn18';
import useData from '@common/hooks/useData';
import AddOrEdit from '../components/AddOrEdit';
import InquiryForm from './SearchForm';
import { deleteByIds as deleteApi } from '@/services/price';

const { Paragraph } = Typography;

const listDataDispatch = 'price/fetchList';

const defaultParams = {
  pageNum: 1,
  pageSize: 10,
  name: '',
};

const PriceManagement = props => {
  const {
    location,
    className,
    dispatch,
    loading,
    price: { data },
  } = props;

  const [filters, setFilters] = useState(defaultParams);
  const [currItem, setCurrItem] = useState(undefined);
  const [visible, setVisible] = useState(false);

  const onSearch = value =>
    setFilters(
      produce(filters, draft => {
        draft.name = value.name || '';
        draft.storeId = value.storeId || '';
      }),
    );

  const handlePageChange = (page, pageSize) => {
    setFilters(
      produce(filters, draft => {
        draft.pageNum = page;
        draft.pageSize = pageSize;
      }),
    );
  };

  const getDataList = () => {
    props.dispatch({
      type: listDataDispatch,
      payload: {
        ...filters,
      },
    });
  };
  useEffect(() => {
    getDataList();
  }, [filters]);

  const pagination = {
    position: 'bottom',
    onChange: handlePageChange,
    ...data.pagination,
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
        deleteApi(record.id).then(res => {
          message.success(formatMessage({ id: 'yeeorder.success' }));
          if (data.list.length === 0 && data.pagination.current > 1) {
            getDataList({ current: data.pagination.current - 1 });
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
    setCurrItem(
      record
        ? JSON.parse(
            JSON.stringify({
              ...record,
              storeId: record.storeModel.id,
              picModel: record.picModel ? [record.picModel] : [],
            }),
          )
        : undefined,
    );
    setVisible(true);
  };

  /**
   * 隐藏modal
   */
  const hideModal = () => {
    setCurrItem(undefined);
    setVisible(false);
  };

  const columns = [
    {
      className: 'nowrap',
      width: 10,
      key: 'index',
      dataIndex: 'id',
      fixed: 'left',
      title: '序号',
    },
    {
      className: 'nowrap',
      dataIndex: 'storeModel.name',
      title: '门店名称',
    },
    {
      className: 'nowrap',
      dataIndex: 'name',
      title: '标签名称',
    },
    {
      className: 'nowrap',
      dataIndex: 'min',
      title: '起始区间',
    },
    {
      className: 'nowrap',
      dataIndex: 'max',
      title: '终止区间',
    },
    {
      className: 'nowrap',
      dataIndex: 'sort',
      width: 80,
      title: '排序',
    },
    {
      key: 'action',
      title: formatMessage({ id: 'yeeorder.action' }),
      fixed: 'right',
      width: 10,
      render: (val, record) => {
        const btnList = [
          <a onClick={() => addOrEditItem(record)}>
            {formatMessage({ id: 'components.table.action.edit' })}
          </a>,
          <a onClick={() => deleteItem(record)}>
            {formatMessage({ id: 'components.table.action.delete' })}
          </a>,
        ];
        return <ActionList actions={btnList} />;
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <InquiryForm onSearch={onSearch} />
        <Row className='mb10'>
          <Button type='primary' onClick={() => addOrEditItem(null)}>
            添加
          </Button>
        </Row>
        <GeneralTable
          loading={loading}
          rowKey='id'
          scroll={{ x: true }}
          columns={columns}
          dataSource={data.list}
          pagination={pagination}
        />
        <AddOrEdit
          visible={visible}
          currItem={currItem}
          hideModal={hideModal}
          getDataList={getDataList}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ price, loading }) => ({
  price,
  loading: loading.effects[listDataDispatch],
}))(PriceManagement);
