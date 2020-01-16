import { Descriptions, Table, Tag } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import _get from 'lodash/get';
import moment from 'moment';
import { QCConf as FORM_KEYS } from '../../config';

class NoLicenss extends Component {
  getAddress = () => {
    const province = _get(this.props, 'qualityChina.legalAddressProName', '');
    const city = _get(this.props, 'qualityChina.legalAddressCityName', '');
    const district = _get(this.props, 'qualityChina.legalAddressDisName', '');
    const detailAddress = _get(this.props, 'qualityChina.detailAddress', '');
    return `${province},${city},${district},${detailAddress}`;
  };

  render() {
    const { qualityChina = {} } = this.props;
    const annualProduction = _get(this.props, 'qualityChina.annualProduction.list', []);
    const ourCustomer = _get(this.props, 'qualityChina.ourCustomer.list', []);
    const address = this.getAddress();
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
      Contact,
      Telephone,
      Email,
      YearEstablished,
      RegistrationCapital,
      OfficeAddress,
      BusinessType,
      ListedCompany,
      AnnualRevenue,
      Employees,
      FactorySize,
      NoProductionLines,
      NoEquipment,
      AnnualExportVolume,
      AnnualProduction,
    } = FORM_KEYS;
    return (
      <>
        <Descriptions style={{ marginBottom: 24 }} column={{ md: 1, xl: 2, xxl: 3 }}>
          <Descriptions.Item label={formatMessage({ id: Contact.label })}>
            {qualityChina[Contact.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Telephone.label })}>
            {qualityChina[Telephone.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Email.label })}>
            {qualityChina[Email.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: YearEstablished.label })}>
            {qualityChina[YearEstablished.key]
              ? moment(qualityChina[YearEstablished.key]).format('YYYY')
              : '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: RegistrationCapital.label })}>
            {qualityChina[RegistrationCapital.key]
              ? `$${qualityChina[RegistrationCapital.key]}`
              : '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: OfficeAddress.label })}>
            {address || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: BusinessType.label })}>
            {qualityChina[`${BusinessType.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: ListedCompany.label })}>
            {qualityChina[`${ListedCompany.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: AnnualRevenue.label })}>
            {qualityChina[`${AnnualRevenue.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: Employees.label })}>
            {qualityChina[`${Employees.key}Text`] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: FactorySize.label })}>
            {qualityChina[FactorySize.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: NoProductionLines.label })}>
            {qualityChina[NoProductionLines.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: NoEquipment.label })}>
            {qualityChina[NoEquipment.key] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: AnnualExportVolume.label })}>
            {qualityChina[AnnualExportVolume.key]
              ? `$${qualityChina[AnnualExportVolume.key]}`
              : '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions style={{ marginBottom: 24 }} layout='vertical'>
          <Descriptions.Item label={formatMessage({ id: AnnualProduction.label })} column={2}>
            {annualProduction.length ? (
              <Table columns={columns} dataSource={annualProduction} bordered pagination={false} />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title={formatMessage({ id: 'profile.our-customer' })}
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
      </>
    );
  }
}

export default NoLicenss;
