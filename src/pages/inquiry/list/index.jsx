import React, { useState, useCallback } from 'react';
import { Card, Badge, Tooltip, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import produce from 'immer';
import { Link } from 'umi';
import GeneralTable from '@common/components/GeneralTable';
import DateIn18 from '@common/components/DateIn18';
import useData from '@common/hooks/useData';
import InquiryForm from './SearchForm';
import { queryInquiryData } from '../service';

const { Paragraph } = Typography;

const DEFAULT_PAGE_SIZE = 10;

const defaultPageInfo = {
  pageNo: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

const defaultFilters = {
  pageInfo: defaultPageInfo,
  options: {},
};

const defaultData = {
  records: [],
  ...defaultPageInfo,
  totalCount: 0,
};

const InquiryManagement = () => {
  const [filters, setFilters] = useState(defaultFilters);

  const { pageInfo, options } = filters;

  const onSearch = value =>
    setFilters(
      produce(filters, draft => {
        draft.options = value;
        draft.pageInfo = defaultPageInfo;
      }),
    );

  const onPageChange = (page, pageSize) => {
    setFilters(
      produce(filters, draft => {
        draft.pageInfo = { pageNo: page, pageSize };
      }),
    );
  };

  const fetchInquiryMethod = () =>
    queryInquiryData({
      ...pageInfo,
      ...options,
    });

  const dataLoader = useCallback(() => fetchInquiryMethod(), [filters]);

  const {
    data: { records, pageNo, pageSize, totalCount },
    isLoading,
  } = useData(dataLoader, defaultData);

  const pagination = {
    total: totalCount,
    pageSize,
    current: pageNo,
    onChange: onPageChange,
  };

  const columns = [
    {
      className: 'nowrap',
      width: 10,
      key: 'index',
      fixed: 'left',
      title: formatMessage({ id: 'yeeorder.No' }),
      render: (text, record, index) => (pageNo - 1) * pageSize + index + 1,
    },
    {
      className: 'nowrap',
      width: 10,
      fixed: 'left',
      dataIndex: 'contactNo',
      title: formatMessage({ id: 'inquiry.inquiry-no' }),
      render: (val, row) => <Link to={`/inquiry/${row.id}/detail`}>{val}</Link>,
    },
    {
      dataIndex: 'companyName',
      title: formatMessage({ id: 'inquiry.supplier' }),
      width: 300,
      render: val => (
        <Tooltip placement='topLeft' title={val}>
          <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'productName',
      title: formatMessage({ id: 'inquiry.product-name' }),
      width: 300,
      render: val => (
        <Tooltip placement='topLeft' title={val}>
          <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'gmtCreate',
      title: formatMessage({ id: 'inquiry.last-update' }),
      render(val) {
        return val ? <DateIn18 date={val} fullTime /> : '--';
      },
    },
    {
      key: 'action',
      title: formatMessage({ id: 'yeeorder.action' }),
      fixed: 'right',
      width: 10,
      render: (val, row) => (
        <>
          <Link style={{ marginRight: 8 }} to={`/inquiry/${row.id}/detail`}>
            {formatMessage({ id: 'yeeorder.Detail' })}
          </Link>
          {!row.readFlag && <Badge status='error' />}
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <InquiryForm onSearch={onSearch} />
        <GeneralTable
          loading={isLoading}
          rowKey='id'
          scroll={{ x: true }}
          columns={columns}
          dataSource={records}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(inquiry => ({
  inquiryData: inquiry.inquiryData,
}))(InquiryManagement);
