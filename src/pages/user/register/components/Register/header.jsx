import { FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Layout } from 'antd';
import classNames from 'classnames';
import React from 'react';
import config from '@common/config/index';
import { linkToLogin } from '@/utils/user';
import styles from './header.less';
import logo from '@/assets/user/logo.png';
import SelectLang from '@/components/SelectLang';

const { Header } = Layout;

const RegisterHeader = props => {
  const { className, hideLogo } = props;

  const handleSignIn = () => {
    linkToLogin(config.mallHost);
  };

  return (
    <Header className={classNames(className, styles.registerHeader)}>
      {hideLogo ? null : (
        <Link to='/'>
          <img src={logo} className={styles.registerHeaderLogo} alt='logo' />
        </Link>
      )}
      <div className={styles.registerHeaderRight}>
        <a onClick={handleSignIn} style={{ marginRight: '10px' }}>
          <FormattedMessage id='page.register.button.signIn' />
        </a>
        <SelectLang />
      </div>
    </Header>
  );
};
export default RegisterHeader;
