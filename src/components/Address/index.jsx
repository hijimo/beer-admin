import React from 'react';
import { Input, Select } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import clsx from 'classnames';
import styles from './style.less';

const { Option } = Select;
@connect(({ common }) => ({
  address: common.address || [],
}))
class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initCitys: false,
      initDistricts: false,
    };
  }

  componentDidMount() {
    const { dispatch, address } = this.props;
    if (!address || (address && !address.length)) {
      dispatch({ type: 'common/fetchAddress', payload: { toLevel: 1 } });
    }
  }

  componentDidUpdate() {
    const { initCitys, initDistricts } = this.state;
    const { value, address } = this.props;
    const provinces = address || [];
    if (this.props.value && this.props.value.city && !initCitys) {
      const province =
        value && value.province !== undefined ? provinces.find(t => value.province === t.id) : null;
      if (province && (!province.children || !province.children.length)) {
        this.setState({ initCitys: true }, () => {
          this.fetchCitys(province);
        });
      }
    }
    if (this.props.value && this.props.value.district && !initDistricts) {
      const province =
        value && value.province !== undefined ? provinces.find(t => value.province === t.id) : null;
      const city =
        province && province.children ? province.children.find(t => t.id === value.city) : null;
      if (city && (!city.children || !city.children.length)) {
        this.setState({ initDistricts: true }, () => {
          this.fetchCitys(city);
        });
      }
    }
  }

  handleProChange = (key, val) => {
    const { address, value } = this.props;
    const provinces = address || [];

    const data = {
      ...this.props.value,
      [key]: val,
    };
    if (key === 'province') {
      const item = provinces.find(t => t.id !== undefined && t.id === val);
      data.provinceName = (item || { name: '' }).name;
      data.city = '';
      data.cityName = '';
      data.district = '';
      data.districtName = '';
      if (!item.children || (item.children && !item.children.length)) {
        this.fetchCitys(item);
      }
    }
    if (key === 'city') {
      const province =
        value && value.province !== undefined ? provinces.find(t => value.province === t.id) : null;
      if (province) {
        const item = province.children.find(t => t.id === val);
        data.cityName = item.name;
        data.district = '';
        data.districtName = '';
        if (!item.children || (item.children && !item.children.length)) {
          this.fetchCitys(item);
        }
      }
    }
    if (key === 'district') {
      const province = address.find(t => t.id === value.province);
      const city = province.children.find(t => t.id === value.city);
      const item = city.children.find(t => t.id === val);
      data.districtName = item.name;
    }
    if (this.props.handleChange) {
      this.props.handleChange(data);
    }
  };

  fetchCitys(parent) {
    const { dispatch } = this.props;
    if (!parent) {
      throw new TypeError('PARENT REQUIRED');
    }
    dispatch({ type: 'common/fetchAddressLeaf', payload: { pid: parent.id } });
  }

  render() {
    const { value, address, hideDetailAddress } = this.props;
    const provinces = address || [];
    const province =
      value && value.province !== undefined ? provinces.find(t => value.province === t.id) : null;
    const citys = province && province.children ? province.children : [];
    const city = value && value.city !== undefined ? citys.find(t => value.city === t.id) : null;
    const districts = city && city.children ? city.children : [];

    return (
      <div className={clsx('ucharm-address-selector', styles.root)}>
        <Select
          value={value ? value.province : ''}
          onChange={val => this.handleProChange('province', val)}
          placeholder={formatMessage({ id: 'yeeorder.please-select' })}
        >
          {provinces.map(t => (
            <Option key={t.id} value={t.id}>
              {t.name}
            </Option>
          ))}
        </Select>
        <Select
          value={value ? value.city : ''}
          onChange={val => this.handleProChange('city', val)}
          placeholder={formatMessage({ id: 'yeeorder.please-select' })}
        >
          {citys.map(t => (
            <Option key={t.id} value={t.id}>
              {t.name}
            </Option>
          ))}
        </Select>
        <Select
          value={value ? value.district : ''}
          onChange={val => this.handleProChange('district', val)}
          placeholder={formatMessage({ id: 'yeeorder.please-select' })}
        >
          {districts.map(t => (
            <Option key={t.id} value={t.id}>
              {t.name}
            </Option>
          ))}
        </Select>
        {!hideDetailAddress && (
          <Input
            value={value ? value.detail : ''}
            onChange={e => this.handleProChange('detail', e.target.value)}
          />
        )}
      </div>
    );
  }
}

export default Address;
