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
import { deleteByIds as deleteApi } from '@/services/decoration';

const { Paragraph } = Typography;

const listDataDispatch = 'decoration/fetchList';

const defaultParams = {
  pageNum: 1,
  pageSize: 10,
  name: '',
};

const pageEnums = [
  { label: '选择分类页', value: 1 },
  { label: '品牌国家页', value: 2 },
  { label: '排行页', value: 3 },
  { label: '商品列表页', value: 4 },
  { label: '商品详情页', value: 5 },
];
const DecorationManagement = props => {
  const {
    location,
    className,
    dispatch,
    loading,
    decoration: { data },
  } = props;

  const [filters, setFilters] = useState(defaultParams);
  const [currItem, setCurrItem] = useState(undefined);
  const [visible, setVisible] = useState(false);

  const onSearch = value =>
    setFilters(
      produce(filters, draft => {
        draft.name = value.name || '';
        draft.storeId = value.storeId || '';
        draft.categoryId = value.categoryId || '';
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
              bgModel: record.bgModel ? [record.bgModel] : [],
              columnsModel: (record.columns ? JSON.parse(record.columns) : []).map(it => ({
                ...it,
              })),
              primaryBtnBgModel: record.primaryBtnBgModel ? [record.primaryBtnBgModel] : [],
              titleBgModel: record.titleBgModel ? [record.titleBgModel] : [],
              title1BgModel: record.title1BgModel ? [record.title1BgModel] : [],
              img1Model: record.img1Model ? [record.img1Model] : [],
              img2Model: record.img2Model ? [record.img2Model] : [],
              bg1Model: record.bg1Model ? [record.bg1Model] : [],
              bg2Model: record.bg2Model ? [record.bg2Model] : [],
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
      dataIndex: 'page',
      title: '所属页面',
      render: (text, reocrd) => pageEnums.find(it => it.value === text).label,
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

export default connect(({ decoration, loading }) => ({
  decoration,
  loading: loading.effects[listDataDispatch],
}))(DecorationManagement);
