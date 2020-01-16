import { Badge, Card, Form, Typography, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import router from 'umi/router';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import SearchForm from './SearchForm';
import { StatusMap, QcListKeys } from '../enum';

const { Paragraph } = Typography;
const {
  QCNO,
  PONo,
  UploadDate,
  Buyer,
  UploadingParty,
  TotalQuantity,
  InspectedQuantity,
  FailedQuantity,
  QCResult,
  Action,
} = QcListKeys;

@connect(({ qc, loading }) => ({
  productQC: qc.productQC,
  tableLoading: loading.effects['qc/fetchProductQC'],
}))
class ProductQC extends Component {
  state = {
    searchParams: {},
  };

  componentDidMount() {
    this.fetchProductQcMethod();
  }

  fetchProductQcMethod = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch } = this.props;
    const params = {
      ...pageInfo,
      ...this.state.searchParams,
    };
    dispatch({
      type: 'qc/fetchProductQC',
      payload: params,
    });
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchProductQcMethod();
      },
    );
  };

  changePage = ({ current: pageNo, pageSize }) => this.fetchProductQcMethod({ pageNo, pageSize });

  showDetail = val => {
    router.push(`/QCManagement/productQC/${val}/detail`);
  };

  render() {
    const { productQC, tableLoading } = this.props;
    const { current, pageSize } = productQC.pagination;
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
        width: 10,
        title: formatMessage({ id: QCNO.label }),
        dataIndex: QCNO.key,
        fixed: 'left',
        render: (val, row) => <a onClick={() => this.showDetail(row.id)}>{val}</a>,
      },
      {
        title: formatMessage({ id: PONo.label }),
        dataIndex: 'allOrderNo',
        width: 150,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val && val.split(',').join(', ')}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: UploadDate.label }),
        dataIndex: UploadDate.key,
        render: val => <DateIn18 date={val} fullTime />,
      },
      {
        title: formatMessage({ id: Buyer.label }),
        dataIndex: 'allPurchaseName',
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: UploadingParty.label }),
        dataIndex: UploadingParty.key,
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: TotalQuantity.label }),
        dataIndex: TotalQuantity.key,
        align: 'right',
      },
      {
        title: formatMessage({ id: InspectedQuantity.label }),
        dataIndex: InspectedQuantity.key,
        align: 'right',
      },
      {
        title: formatMessage({ id: FailedQuantity.label }),
        dataIndex: FailedQuantity.key,
        align: 'right',
      },
      {
        title: formatMessage({ id: QCResult.label }),
        dataIndex: QCResult.key,
        render: (val, row) => {
          const status = StatusMap.find(item => item.value === val);
          return <Badge color={status.color} text={row.qcResultText} />;
        },
      },
      {
        className: 'nowrap',
        width: 10,
        title: formatMessage({ id: Action.label }),
        fixed: 'right',
        render: row => (
          <a onClick={() => this.showDetail(row.id)}>{formatMessage({ id: 'yeeorder.Details' })}</a>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <SearchForm handleSearch={this.handleSearch} />
          <GeneralTable
            rowKey='qcNo'
            loading={tableLoading}
            columns={columns}
            dataSource={productQC.list}
            pagination={productQC.pagination}
            scroll={{ x: true }}
            onChange={this.changePage}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ProductQC);
