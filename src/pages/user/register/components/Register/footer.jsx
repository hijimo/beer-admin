import { FormattedMessage } from 'umi-plugin-react/locale';
import classNames from 'classnames';
import React from 'react';
import logoBlackRed from '@/assets/logo-lite-black-red@2x.png';

import styles from './footer.less';

const Footer = props => {
  const { className, hideLogo } = props;

  return (
    <div className={classNames(className, styles.registerFooter)}>
      {hideLogo ? null : (
        <img className={styles.registerFooterLogo} src={logoBlackRed} alt='logo' />
      )}
      <div className={classNames(styles.registerFooterRowContent, 'registerFooterRowContent')}>
        <div className={classNames(styles.registerFooterRow, 'registerFooterRow')}>
          <FormattedMessage id='page.register.text.copyrightDesc' />
        </div>
        <div className={classNames(styles.registerFooterRow, 'registerFooterRow')}>
          <FormattedMessage id='page.register.text.copyright' />
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='http://idinfo.zjamr.zj.gov.cn/bscx.do?method=lzxx&id=3301063301840000480096'
          >
            <img
              alt='ic'
              src='https://img.yeeorder.com/default/i_lo2.gif'
              style={{ width: '20px', height: '20px', marginLeft: '10px', verticalAlign: '-3px' }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};
export default Footer;
