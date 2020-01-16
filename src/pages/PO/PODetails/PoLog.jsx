import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import GeneralTable from '@common/components/GeneralTable';
import DateIn18 from '@common/components/DateIn18';
import _get from 'lodash/get';
import { Detailkeys } from '../enum';
import '../style.less';

const { LogDate, LogOriginal, LogUpdated } = Detailkeys;
class PoLog extends PureComponent {
  render() {
    const orderLogDetailDTOList = _get(this.props.poDetail, 'orderLogDetailDTOList', []);
    const columns = [
      {
        className: 'nowrap',
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        fixed: 'left',
        width: 10,
        render(val, row, index) {
          return index + 1;
        },
        key: 'index',
      },
      {
        title: formatMessage({ id: LogDate.label }),
        dataIndex: LogDate.key,
        render: val => <DateIn18 date={val} />,
      },
      {
        title: formatMessage({ id: LogOriginal.label }),
        dataIndex: LogOriginal.key,
      },
      {
        title: formatMessage({ id: LogUpdated.label }),
        dataIndex: LogUpdated.key,
      },
    ];
    return (
      <GeneralTable
        rowKey={(row, index) => index}
        scroll={{ x: true }}
        columns={columns}
        dataSource={orderLogDetailDTOList}
        pagination={false}
      />
    );
  }
}

export default PoLog;
