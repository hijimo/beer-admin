import { Button, Badge, Card, Descriptions } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import router from 'umi/router';
import _get from 'lodash/get';
import styles from '../../style.less';
import { verConf as FORM_KEYS } from '../../config';

const auditStatusColor = ['cyan', 'orange', 'green', 'red'];
const auditStatusBgColor = [
  'rgba(255,255,255,1)',
  'rgba(255,242,232,1)',
  'rgba(246,255,237,1)',
  'rgba(255,241,240,1)',
];
class Verification extends Component {
  handleEdit = () => {
    router.push('/myCompany/EditVerification');
  };

  render() {
    const { companyInfo } = this.props;
    const businessLicImgUrl = _get(companyInfo, 'businessLicImgUrl.attachments', []);
    const { auditStatus, auditStatusText } = companyInfo;
    return (
      <Card
        title={
          <div>
            {formatMessage({ id: 'profile.verification' })}
            <Badge
              count={auditStatusText}
              style={{
                marginLeft: '20px',
                backgroundColor: auditStatusBgColor[auditStatus],
                color: auditStatusColor[auditStatus],
                border: `1px solid ${auditStatusColor[auditStatus]}`,
              }}
            />
          </div>
        }
        style={{ marginBottom: 24 }}
        bordered={false}
        extra={
          <Button type='link' onClick={this.handleEdit} disabled={auditStatus === 1}>
            {formatMessage({ id: 'yeeorder.Update' })}
          </Button>
        }
        className={styles.verification}
      >
        <Descriptions style={{ marginBottom: 24 }} column={{ md: 1, xl: 2, xxl: 3 }}>
          <Descriptions.Item label={formatMessage({ id: FORM_KEYS.CompanyName.label })}>
            {companyInfo[FORM_KEYS.CompanyName.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FORM_KEYS.CorporateRepresentative.label })}>
            {companyInfo[FORM_KEYS.CorporateRepresentative.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FORM_KEYS.SocialCreditCode.label })}>
            {companyInfo[FORM_KEYS.SocialCreditCode.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FORM_KEYS.IdentityNumber.label })}>
            {companyInfo[FORM_KEYS.IdentityNumber.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FORM_KEYS.OfferingFields.label })}>
            {companyInfo.offeringFieldsName || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FORM_KEYS.BusinessLicense.label })}>
            {businessLicImgUrl && businessLicImgUrl.length ? (
              <UploadList
                disabled
                value={businessLicImgUrl || []}
                listType='picture-card'
                maxLength={0}
              />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}

export default Verification;
