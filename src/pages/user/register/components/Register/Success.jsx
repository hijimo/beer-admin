import { Button, Icon } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import classNames from 'classnames';
import React from 'react';
import config from '@common/config/index';
import { linkToLogin } from '@/utils/user';
import styles from './Success.less';

const Success = props => {
  /* type === 1 ? 注册 type === 2 ? 找回密码 */
  const { className, type = 1 } = props;

  const handleSignIn = () => {
    linkToLogin(config.mallHost);
  };
  return (
    <div className={classNames(className, styles.registerSuccess)}>
      <Icon type='check-circle' theme='filled' className={styles.icon} />
      <div className={styles.resisterTip}>
        {type === 1 ? (
          <FormattedMessage id='page.register.text.accountCreated' />
        ) : (
          <FormattedMessage id='page.register.text.resetPwdSuccess' />
        )}
      </div>

      <Button onClick={handleSignIn} type='primary' className={styles.registerButton}>
        <FormattedMessage id='page.register.button.signIn' />
      </Button>
    </div>
  );
};
export default Success;
