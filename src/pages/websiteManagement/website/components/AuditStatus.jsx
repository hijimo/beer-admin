import { Alert } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import _get from 'lodash/get';

const DRAFT = 0;
const SUCCESS = 1;
const FAIL = 2;
const AUDITING = 3;
class AuditStatus extends Component {
  getDescription = auditStatus => {
    const auditReason = _get(this.props, 'websiteInfo.pageAuditReason', '');
    let description = '';
    if (auditStatus === SUCCESS) {
      description = `${formatMessage({ id: 'website.audit-status-description.success' })}`;
    } else if (auditStatus === FAIL) {
      description = `
        ${formatMessage({ id: 'website.audit-status-description.fail' })}:\r\n
        ${auditReason}
      `;
    }
    return description;
  };

  render() {
    const auditStatus = _get(this.props, 'websiteInfo.pageAudit', 0);
    const description = this.getDescription(auditStatus);
    let message = '';
    let type = '';
    if (auditStatus === AUDITING) {
      message = `${formatMessage({ id: 'yeeorder.Auditing' })}...`;
      type = 'warning';
    } else if (auditStatus === SUCCESS) {
      message = `${formatMessage({ id: 'yeeorder.Pass' })}`;
      type = 'success';
    } else if (auditStatus === FAIL) {
      message = `${formatMessage({ id: 'yeeorder.Fail' })}`;
      type = 'error';
    }
    const closable = auditStatus === FAIL;
    return auditStatus === DRAFT ? null : (
      <div style={{ marginBottom: 16 }}>
        <Alert
          className='audit_status'
          showIcon
          message={message}
          description={description}
          type={type}
          closable={closable}
        />
      </div>
    );
  }
}

export default AuditStatus;
