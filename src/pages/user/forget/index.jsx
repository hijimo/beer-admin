import React, { useState, useEffect } from 'react';
import { Form, Steps, Button, Layout } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import classNames from 'classnames';
import router from 'umi/router';
import Footer from '@common/components/GlobalFooter/GlobalFooter';
import { postSendEmailCode, getEmailVerifyCodeCheck } from '@/services/common';
import { postRetrievePwd } from '@/services/user';
import { registerTplTypeEnum } from '@/enums/user';
import EmailForm from '../register/components/Register/EmailForm';
import TipsInfo from '../register/components/Register/TipsInfo';
import PasswordForm from '../register/components/Register/PasswordForm';
import Success from '../register/components/Register/Success';
import Header from '../register/components/Register/header';
import styles from '../register/style.less';

const { Step } = Steps;
const { Content } = Layout;
const Register = props => {
  const { className, location, form } = props;
  const [currentStep, setCurrentStep] = useState(-1);
  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState('');

  const sendEmailCode = (registerEmail, onSuccess) => {
    // 验证码类型 1：注册 2：找回密码
    const params = {
      verifyCodeType: '2',
      email: registerEmail,
    };
    setEmailLoading(true);
    postSendEmailCode(params).then(res => {
      setEmailLoading(false);
      if (res.success) {
        if (onSuccess) {
          onSuccess(res);
        }
      }
    });
  };

  useEffect(() => {
    const { email: emailByQuery, encryptionKey } = location.query;
    setCurrentStep(0);
    if (encryptionKey) {
      getEmailVerifyCodeCheck({
        code: encryptionKey,
        email: emailByQuery,
        templateType: registerTplTypeEnum.RETRIEVE_PASSWORD,
        deleteCode: false,
      }).then(res => {
        const { success } = res;
        if (success) {
          // 邮件认证成功，
          setCurrentStep(2);
        } else {
          // 进入过期页
          router.replace('/expire?type=2');
        }
      });
    }
    if (emailByQuery) {
      setEmail(emailByQuery);
    }
  }, []);
  const handleEmailFormSubmit = values => {
    const { email: registerEmail } = values;
    sendEmailCode(registerEmail, () => {
      setEmail(registerEmail);
      setCurrentStep(1);
    });
  };
  const handleChangeEmail = () => {
    setCurrentStep(0);
  };

  const handleReSend = () => {
    sendEmailCode(email);
  };
  const handleSubmit = () => {
    form.validateFields((error, values) => {
      if (!error) {
        const { encryptionKey } = location.query;
        const params = {
          userEmail: email,
          verifyCode: encryptionKey,
          userPassword: values.password,
        };
        postRetrievePwd(params).then(res => {
          if (res.success) {
            // 找回密码成功
            setCurrentStep(3);
          }
        });
      }
    });
  };
  const renderForm = () => {
    switch (currentStep) {
      case 0:
        return <EmailForm onSuccess={handleEmailFormSubmit} type={2} loading={emailLoading} />;
      case 1:
        return (
          <TipsInfo onChangeEmailClick={handleChangeEmail} onResend={handleReSend} eMail={email} />
        );
      case 2:
        return (
          <>
            <PasswordForm eMail={email} form={form} />

            <Button type='primary' onClick={handleSubmit} className={styles.buttonSubmit}>
              {formatMessage({ id: 'page.register.button.confirm' })}
            </Button>
          </>
        );
      case 3:
        return <Success type={2} />;
      default:
        break;
    }
    return null;
  };
  return (
    <Layout className={classNames(styles.pageRegister, className)}>
      <Header />
      <Content className={styles.pageRegisterContent}>
        <Steps current={currentStep} className={styles.pageRegisterSteps}>
          <Step title={formatMessage({ id: 'page.register.step.verifyEmail' })} />
          <Step title={formatMessage({ id: 'page.register.step.verifyAccount' })} />
          <Step title={formatMessage({ id: 'page.register.step.modifyPassword' })} />
        </Steps>
        <div className={styles.formContainer}>
          <div style={{ width: '100%' }}>{renderForm()}</div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Form.create()(Register);
