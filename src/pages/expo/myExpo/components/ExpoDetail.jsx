import { Modal, Button, Descriptions } from 'antd';
import React, { PureComponent } from 'react';
import DateIn18 from '@common/components/DateIn18';
import { formatMessage } from 'umi-plugin-react/locale';

const FORM_KEYS = {
  ExpoName: 'title',
  ExpoLocation: 'address',
  ExpoStateDate: 'startTime',
  ExpoEndDate: 'endTime',
  Contact: 'contacts',
  Telephone: 'contactWay',
  MyApplication: 'auditStatusText',
  AuditReason: 'auditReason',
};

class ExpoDetail extends PureComponent {
  handleClose = () => {
    this.props.handleClose();
  };

  render() {
    const { visible, detail } = this.props;
    return (
      <Modal
        title={formatMessage({ id: 'application.expo-details' })}
        visible={visible}
        onCancel={this.handleClose}
        footer={[
          <Button key='back' onClick={this.handleClose}>
            {formatMessage({ id: 'yeeorder.Close' })}
          </Button>,
        ]}
      >
        <Descriptions>
          <Descriptions.Item span={3} label={formatMessage({ id: 'application.list.expo-name' })}>
            {detail[FORM_KEYS.ExpoName]}
          </Descriptions.Item>
          <Descriptions.Item
            span={3}
            label={formatMessage({ id: 'application.list.expo-location' })}
          >
            {detail[FORM_KEYS.ExpoLocation]}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={formatMessage({ id: 'application.list.expo-date' })}>
            <DateIn18 date={detail[FORM_KEYS.ExpoStateDate]} /> -{' '}
            <DateIn18 date={detail[FORM_KEYS.ExpoEndDate]} />
          </Descriptions.Item>
          <Descriptions.Item span={3} label={formatMessage({ id: 'application.list.contact' })}>
            {detail[FORM_KEYS.Contact]}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={formatMessage({ id: 'application.list.telephone' })}>
            {detail[FORM_KEYS.Telephone]}
          </Descriptions.Item>
          <Descriptions.Item
            span={3}
            label={formatMessage({ id: 'application.list.my-application' })}
          >
            {detail[FORM_KEYS.MyApplication]}
          </Descriptions.Item>
          {detail.auditStatus === 2 && (
            <Descriptions.Item
              span={3}
              label={formatMessage({ id: 'application.list.fail-reason' })}
            >
              {detail[FORM_KEYS.AuditReason]}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Modal>
    );
  }
}

export default ExpoDetail;
