import { Icon, Menu } from 'antd';
import { formatMessage, getLocale, setLocale } from 'umi-plugin-react/locale';
import React from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const SelectLang = props => {
  const { className } = props;
  const selectedLang = getLocale();

  const changeLang = ({ key }) => setLocale(key, true);

  const locales = ['zh-CN', 'cs-CZ', 'en-US'];
  const languageLabels = {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'cs-CZ': 'Česky',
  };
  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map(locale => (
        <Menu.Item key={locale}>{languageLabels[locale]}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement='bottomRight'>
      <span className={classNames(styles.dropDown, className)}>
        {languageLabels[selectedLang]}
        <Icon type='down' title={formatMessage({ id: 'navBar.lang' })} />
      </span>
    </HeaderDropdown>
  );
};

export default SelectLang;
