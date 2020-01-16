import { Modal, Icon } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { fetchCountry } from '@/services/profile';
import styles from '../style.less';

class SelectCountry extends Component {
  allCountry = [];

  oldCountry = [];

  state = {
    countryList: [],
  };

  componentDidMount() {
    // 把初始值存起来
    const { country } = this.props;
    this.oldCountry = country;
    this.fetchCountryMethods();
  }

  fetchCountryMethods = () => {
    fetchCountry({ toLevel: 1 }).then(res => {
      const { success, data } = res;
      if (success) {
        this.allCountry = [...data];
        const { country } = this.props;
        const countryId = country.map(({ id }) => id);
        this.getCountryList(countryId);
      }
    });
  };

  getCountryList = countryId => {
    const countryList = this.allCountry.map(item =>
      Object.assign({}, item, {
        checked: countryId.includes(item.id),
      }),
    );
    this.setState({ countryList });
  };

  handleOk = () => {
    const { toggleDialog, countryChange } = this.props;
    const { countryList } = this.state;
    toggleDialog();
    const selectedCountry = countryList.filter(item => item.checked);
    countryChange(selectedCountry);

    const countryId = selectedCountry.map(({ id }) => id);
    this.oldCountry = selectedCountry;
    this.getCountryList(countryId);
  };

  handleCancel = () => {
    const { toggleDialog } = this.props;
    toggleDialog();
    const countryId = this.oldCountry.map(({ id }) => id);
    this.getCountryList(countryId);
  };

  chooseCountry = (e, item) => {
    const { id, checked } = item;
    const { countryList } = this.state;
    const newCountryList = countryList.map(newItem =>
      Object.assign({}, newItem, {
        checked: newItem.id === id ? !checked : newItem.checked,
      }),
    );
    this.setState({ countryList: newCountryList });
  };

  render() {
    const { modalVisible } = this.props;
    const { countryList } = this.state;
    const Country = ({ item }) => (
      <div className={styles.selectItem} onClick={e => this.chooseCountry(e, item)}>
        {item.name}
        {item.checked && <Icon type='check' />}
      </div>
    );
    return (
      <div>
        <Modal
          title={formatMessage({ id: 'profile.select-country' })}
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <div className={styles.selectList}>
            {countryList.map(item => (
              <Country item={item} key={item.id} />
            ))}
          </div>
        </Modal>
      </div>
    );
  }
}

export default SelectCountry;
