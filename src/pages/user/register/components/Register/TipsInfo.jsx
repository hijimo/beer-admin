import { Button } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';

import useCountDown from '@/hooks/useCountDown';
import styles from './TipsInfo.less';

const sendInterval = 60;

const TipsInfo = props => {
  const { onChangeEmailClick, onResend, className, eMail, clearLoading = 1 } = props;
  const [delay, setDelay] = useState(0);
  const [cleanup, reset] = useCountDown(sendInterval, c => {
    setDelay(c);
  });

  useEffect(() => {
    if (clearLoading !== 1) {
      cleanup();
    }
  }, [clearLoading]);

  useEffect(() => {
    setDelay(sendInterval);
    return () => {
      cleanup();
    };
  }, []);
  const handleChangeEmail = e => {
    e.preventDefault();
    if (onChangeEmailClick) {
      onChangeEmailClick(e);
    }
  };
  const handleResend = e => {
    e.preventDefault();
    reset();
    setDelay(sendInterval);
    if (onResend) {
      onResend(e);
    }
  };
  return (
    <div className={classNames(className, styles.tipsInfo)}>
      <p className={styles.tipsInfoTip}>
        <FormattedMessage id='page.register.text.tip' />
      </p>
      <div className={styles.tipsInfoEmail}>
        {eMail || ''}
        <a className={styles.tipsInfoLink} onClick={handleChangeEmail}>
          <FormattedMessage id='page.register.link.changeEmail' />
        </a>
      </div>
      <div></div>
      <div>
        {delay > 0 ? (
          <span className={styles.tipsInfoTip2}>
            <FormattedMessage id='page.register.text.tip2' />
            {delay}s
          </span>
        ) : (
          <Button className={styles.tipsInfoSubmit} onClick={handleResend} type='primary'>
            <FormattedMessage id='page.register.link.resendEmail' />
          </Button>
        )}
      </div>
    </div>
  );
};
export default TipsInfo;
