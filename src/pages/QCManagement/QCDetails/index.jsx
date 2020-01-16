import React, { Component } from 'react';
import { Card, Descriptions, Typography, Modal, List, Button, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import GeneralTable from '@common/components/GeneralTable';
import DateIn18 from '@common/components/DateIn18';
import { QcDetailKeys } from '../enum';

const { Paragraph } = Typography;
const {
  QCNO,
  QCResult,
  TotalQuantity,
  InspectedQuantity,
  FailedQuantity,
  UploadingParty,
  UploadDate,
  Remark,
  ProductName,
  PONO,
  Spec,
  Buyer,
  PoRaiseData,
} = QcDetailKeys;

@connect(({ qc, loading }) => ({
  qcDetail: qc.qcDetail,
  pageLoading: loading.effects['qc/fetchQcDetail'],
}))
class QCDetails extends Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    this.fetchDetailMethod();
  }

  fetchDetailMethod = () => {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'qc/fetchQcDetail',
      payload: { id: Number(id) },
    });
  };

  showModal = e => {
    e.preventDefault();
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  handleDownload = url => {
    window.open(url);
  };

  render() {
    const { visible } = this.state;
    const { qcDetail, pageLoading } = this.props;
    const { productDTOS = [], qcReportList = [] } = qcDetail;
    const descLayout = { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 };
    const description = (
      <>
        <Descriptions column={descLayout}>
          <Descriptions.Item label={formatMessage({ id: QCResult.label })}>
            {qcDetail.qcResultText || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: TotalQuantity.label })}>
            {qcDetail[TotalQuantity.key]}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: InspectedQuantity.label })}>
            {qcDetail[InspectedQuantity.key]}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FailedQuantity.label })}>
            {qcDetail[FailedQuantity.key]}
          </Descriptions.Item>
        </Descriptions>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title style={{ margin: 0, marginRight: 16 }} level={4}>
            {formatMessage({ id: 'qc.detail.qc-report' })}
          </Typography.Title>
          <p style={{ flex: 1, margin: 0, borderBottom: '1px dashed #e8e8e8' }}></p>
        </div>
        <Descriptions column={descLayout}>
          <Descriptions.Item>
            <a onClick={e => this.showModal(e)}>{formatMessage({ id: 'qc.detail.view-report' })}</a>
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: UploadingParty.label })}>
            {qcDetail[UploadingParty.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: UploadDate.label })}>
            {qcDetail[UploadDate.key] ? (
              <DateIn18 date={qcDetail[UploadDate.key]} fullTime />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item label={formatMessage({ id: Remark.label })}>
            {qcDetail[Remark.key] || '--'}
          </Descriptions.Item>
        </Descriptions>
      </>
    );
    const columns = [
      {
        className: 'nowrap',
        width: 10,
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        fixed: 'left',
        render: (text, record, index) => `${index + 1}`,
        key: 'index',
      },
      {
        title: formatMessage({ id: ProductName.label }),
        dataIndex: ProductName.key,
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: PONO.label }),
        dataIndex: PONO.key,
      },
      {
        title: formatMessage({ id: Spec.label }),
        dataIndex: Spec.key,
        render: val => {
          const dom = val
            ? val.split(';').map(item => (
                <>
                  {item}
                  <br />
                </>
              ))
            : '--';
          return dom;
        },
      },
      {
        title: formatMessage({ id: Buyer.label }),
        dataIndex: Buyer.key,
        width: 300,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: PoRaiseData.label }),
        dataIndex: PoRaiseData.key,
        render: val => <DateIn18 date={val} fullTime />,
      },
    ];
    return (
      <PageHeaderWrapper
        loading='pageLoading'
        title={`${formatMessage({ id: 'qc.detail.qc-report-no' })}:${qcDetail[QCNO.key]}`}
        content={description}
      >
        <Card bordered={false}>
          <GeneralTable
            rowKey='id'
            loading={pageLoading}
            scroll={{ x: true }}
            columns={columns}
            dataSource={productDTOS || []}
            pagination={false}
          />
        </Card>
        <Modal
          title={formatMessage({ id: 'qc.detail.report' })}
          visible={visible}
          onCancel={this.hideModal}
          footer={null}
        >
          <List
            size='small'
            bordered={false}
            header={null}
            footer={null}
            split={false}
            dataSource={qcReportList || []}
            renderItem={item => (
              <List.Item key={item.id}>
                <div style={{ display: 'flex', alignItems: 'center' }} key={item.id}>
                  <p style={{ margin: 0 }}>{item.name}</p>
                  <Button type='link' onClick={() => this.handleDownload(item.url)}>
                    {formatMessage({ id: 'yeeorder.Download' })}
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default QCDetails;
