import { Card, Descriptions, Table, Tag } from 'antd';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import { connect } from 'dva';
import _get from 'lodash/get';
import moment from 'moment';
import { fetchCompany } from '@/services/profile';
import { profileConf as FORM_KEYS } from '../../config';
import styles from '../../style.less';

@connect(({ myCompany, user }) => ({
  myCompany,
  user,
}))
class Profile extends PureComponent {
  state = {
    companyInfo: {},
  };

  componentDidMount() {
    this.fetchCompanyMethod();
  }

  fetchCompanyMethod = () => {
    const {
      user: { currentUser },
    } = this.props;
    const params = { companyNo: currentUser.companyNo };
    fetchCompany(params).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({ companyInfo: data });
      }
    });
  };

  getProductionList = arr => {
    const productionList = [];
    arr.forEach(item => {
      const { name, quantity, uom } = item;
      if (name || quantity || uom) {
        productionList.push(item);
      }
    });
    return productionList;
  };

  render() {
    const { companyInfo } = this.state;
    const companyPhoto = _get(companyInfo, 'companyPhoto.attachments', []);
    const ourCustomer = _get(companyInfo, 'ourCustomer.list', []);
    const annualProduction = _get(companyInfo, 'annualProduction.list', []);
    const productionList = this.getProductionList(annualProduction);
    const paymentPreference = _get(companyInfo, 'paymentPreference.preferenceList', []);
    const preferenceList = paymentPreference.map(({ paymentName }) => paymentName);
    const columns = [
      {
        title: formatMessage({ id: 'profile.product-name' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: formatMessage({ id: 'profile.quantity' }),
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: formatMessage({ id: 'profile.uom' }),
        dataIndex: 'uomText',
        key: 'uomText',
      },
    ];
    const {
      CompanyPhoto,
      CompanyTel,
      CompanyNameEng,
      Contact,
      CompanyWebsite,
      BusinessType,
      CompanyFax,
      RegistrationCapital,
      CompanyEmail,
      AnnualRevenue,
      YearEstablished,
      FinancialAccount,
      Employees,
      BusinessScale,
      FactorySize,
      LegalAddress,
      LegalAddressPro,
      LegalAddressCity,
      LegalAddressDis,
      DetailAddress,
      Listed,
      ProductionLine,
      EquipmentNum,
      AnnualExportVolume,
      AnnualProduction,
      PaymentPreference,
      PreferredPaymentTerm,
      LogisticPartner,
      Pol,
      OurCustomer,
    } = FORM_KEYS;
    return (
      <Card
        title={formatMessage({ id: 'profile.basic-information' })}
        style={{ marginBottom: 24 }}
        bordered={false}
        extra={
          <a onClick={() => router.push('/myCompany/EditProfile')}>
            {formatMessage({ id: 'yeeorder.Edit' })}
          </a>
        }
        className={styles.profile}
      >
        <Descriptions style={{ marginBottom: 24 }} column={{ md: 1, xl: 2, xxl: 3 }}>
          <Descriptions.Item>
            <FormattedMessage id='profile.text' />
          </Descriptions.Item>
        </Descriptions>
        <Descriptions title={formatMessage({ id: 'profile.basic-information' })}>
          <Descriptions.Item label={formatMessage({ id: CompanyPhoto.label })} span={3}>
            {companyPhoto && companyPhoto.length ? (
              <UploadList
                disabled
                value={companyPhoto || []}
                listType='picture-card'
                maxLength={0}
              />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions style={{ marginBottom: 24 }} column={{ md: 1, xl: 2, xxl: 3 }}>
          <Descriptions.Item label={formatMessage({ id: CompanyTel.label })}>
            {companyInfo[CompanyTel.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: CompanyNameEng.label })}>
            {companyInfo[CompanyNameEng.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Contact.label })}>
            {companyInfo[Contact.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: CompanyWebsite.label })}>
            {companyInfo[CompanyWebsite.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: BusinessType.label })}>
            {companyInfo[`${BusinessType.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: CompanyFax.label })}>
            {companyInfo[CompanyFax.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: RegistrationCapital.label })}>
            {companyInfo[RegistrationCapital.key]
              ? `$${companyInfo[RegistrationCapital.key]}`
              : '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: CompanyEmail.label })}>
            {companyInfo[CompanyEmail.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: AnnualRevenue.label })}>
            {companyInfo[`${AnnualRevenue.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: YearEstablished.label })}>
            {companyInfo[YearEstablished.key]
              ? moment(companyInfo[YearEstablished.key]).format('YYYY')
              : '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FinancialAccount.label })}>
            {companyInfo[FinancialAccount.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Employees.label })}>
            {companyInfo[`${Employees.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: BusinessScale.label })}>
            {companyInfo[BusinessScale.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FactorySize.label })}>
            {companyInfo[FactorySize.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: LegalAddress.label })}>
            {`
              ${companyInfo[`${LegalAddressPro.key}Name`]} 
              ${companyInfo[`${LegalAddressCity.key}Name`]} 
              ${companyInfo[`${LegalAddressDis.key}Name`]} 
              ${companyInfo[DetailAddress.key]}
              `}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Listed.label })}>
            {companyInfo[`${Listed.key}Text`] || '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title={formatMessage({ id: 'profile.capacity-overview' })}
          column={{ md: 1, xl: 2, xxl: 3 }}
        >
          <Descriptions.Item label={formatMessage({ id: ProductionLine.label })}>
            {companyInfo[ProductionLine.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: EquipmentNum.label })}>
            {companyInfo[EquipmentNum.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: AnnualExportVolume.label })}>
            {companyInfo[AnnualExportVolume.key] ? `$${companyInfo[AnnualExportVolume.key]}` : '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions style={{ marginBottom: 24 }} layout='vertical'>
          <Descriptions.Item label={formatMessage({ id: AnnualProduction.label })}>
            {productionList.length ? (
              <Table
                rowKey={(row, index) => index}
                columns={columns}
                dataSource={productionList}
                bordered
                pagination={false}
              />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title={formatMessage({ id: 'profile.payment-logistics' })}
          style={{ marginBottom: 24 }}
          column={{ md: 1, xl: 2, xxl: 3 }}
        >
          <Descriptions.Item label={formatMessage({ id: PaymentPreference.label })}>
            {preferenceList.length ? preferenceList.join(', ') : '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: PreferredPaymentTerm.label })}>
            {companyInfo[`${PreferredPaymentTerm.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: LogisticPartner.label })}>
            {companyInfo[LogisticPartner.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Pol.label })}>
            {companyInfo[Pol.key] || '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title={formatMessage({ id: OurCustomer.label })}
          style={{ marginBottom: 24 }}
          column={{ md: 1, xl: 2, xxl: 3 }}
        >
          <Descriptions.Item>
            {ourCustomer.length
              ? ourCustomer.map(item => (
                  <Tag
                    style={{
                      height: '32px',
                      lineHeight: '32px',
                      background: '#fff',
                      borderStyle: 'dashed',
                    }}
                    key={item.id}
                  >
                    {item.name}
                  </Tag>
                ))
              : '--'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}

export default Profile;
