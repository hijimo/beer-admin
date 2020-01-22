import React from 'react';
import { Form, Button, Layout, Result } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import classNames from 'classnames';
import Footer from '@common/components/GlobalFooter/GlobalFooter';
import Header from './components/Register/header';
import styles from './style.less';

const { Content } = Layout;
const Register = props => {
  const { className, location } = props;

  const { type = '1' } = location.query;
  const handleGoRegister = () => {
    if (type === '1') {
      router.replace('/register');
    } else if (type === '2') {
      router.replace('/forget');
    }
  };
  return (
    <Layout className={classNames(styles.pageRegister, className)}>
      <Header />
      <Content style={{ width: '100%' }}>
        <Result
          style={{ marginTop: '130px' }}
          status='warning'
          title={formatMessage({ id: 'page.register.text.expire' })}
          extra={
            <Button type='primary' key='console' onClick={handleGoRegister}>
              {type === '1'
                ? formatMessage({ id: 'page.register.button.registerAgain' })
                : formatMessage({ id: 'page.register.button.forgetAgain' })}
            </Button>
          }
        />
      </Content>
      <Footer />
    </Layout>
  );
};

export default Form.create()(Register);
