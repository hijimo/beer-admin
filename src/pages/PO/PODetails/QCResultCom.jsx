import React, { PureComponent } from 'react';
import { List, Descriptions, Typography } from 'antd';
import Link from 'umi/link';
import { formatMessage } from 'umi-plugin-react/locale';
import DateIn18 from '@common/components/DateIn18';
import { Detailkeys } from '../enum';

const { Paragraph } = Typography;
const { UploadDate, QCItemResult } = Detailkeys;
class QCResultCom extends PureComponent {
  render() {
    const { qcReport = [] } = this.props;
    return (
      <List
        style={{ width: 800 }}
        size='small'
        bordered={false}
        header={null}
        footer={null}
        split={false}
        dataSource={qcReport || []}
        locale={{
          emptyText: `${formatMessage({ id: 'po.detail.no-qc-report' })}`,
        }}
        renderItem={item => (
          <List.Item key={item.id}>
            <Descriptions column={5}>
              <Descriptions.Item>
                <Paragraph ellipsis={{ rows: 1 }}>
                  <Link to={`/QCManagement/productQC/${item.qcReportId}/detail`}>
                    {item.qcNo || '--'}
                  </Link>
                </Paragraph>
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: UploadDate.label })} span={2}>
                {item[UploadDate.key] ? <DateIn18 date={item[UploadDate.key]} fullTime /> : '--'}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: QCItemResult.label })}>
                {item[QCItemResult.key] || '--'}
              </Descriptions.Item>
            </Descriptions>
          </List.Item>
        )}
      />
    );
  }
}

export default QCResultCom;
