import React from 'react';
import router from 'umi/router';
import LoginForm from '@/components/LoginForm';
import logoBig from '@/assets/user/logo-big.png';
import styles from './style.less';

const Login = props => {
  const { location } = props;
  const { redirectUrl, loginType } = location.query;

  const handleLoginSuccess = () => {
    if (loginType != null) {
      router.push('/');
    } else if (redirectUrl != null) {
      window.location.href = redirectUrl;
    } else {
      router.push('/');
    }
    //  else if (window.history.length > 1) {
    //   router.goBack();
    // }
  };
  return (
    <div className={styles.main}>
      <img src={logoBig} alt='logo' className={styles.logoBig} />
      <div className={styles.loginBox}>
        <LoginForm redirectUrl={redirectUrl} loginType={loginType} onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};
export default Login;
