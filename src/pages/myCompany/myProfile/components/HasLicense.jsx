import { Avatar, Descriptions } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import _get from 'lodash/get';
import moment from 'moment';
import { LicenseConf as FORM_KEYS } from '../../config';
import '../../style.less';

const EXPRIED = 4;

class HasLicense extends PureComponent {
  render() {
    const { qualityChina = {} } = this.props;
    const zjCertPhoto = _get(this.props, 'qualityChina.zjCertPhoto.attachments', []);
    const auditStatus = _get(this.props, 'qualityChina.auditStatus');
    const auditStatusText = _get(this.props, 'qualityChina.auditStatusText', '');
    return (
      <>
        <Descriptions style={{ marginBottom: 24 }} column={1}>
          <Descriptions.Item label={formatMessage({ id: FORM_KEYS.License.label })}>
            {zjCertPhoto.map(item => (
              <Avatar src={item.url} shape='square' size={100} key={item.uid} />
            ))}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FORM_KEYS.ValidTo.label })}>
            <span className={auditStatus === EXPRIED ? 'expireTime' : ''}>
              {moment(qualityChina[FORM_KEYS.ValidTo.key]).format('YYYY-MM-DD')}
              {auditStatus === EXPRIED && <span style={{ marginLeft: 20 }}>{auditStatusText}</span>}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </>
    );
  }
}

export default HasLicense;
