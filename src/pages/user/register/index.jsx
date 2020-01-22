import React, { useState, useEffect } from 'react';
import { Form, Steps, Button, Layout } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import classNames from 'classnames';
import router from 'umi/router';
import Footer from '@common/components/GlobalFooter/GlobalFooter';
import { postSendEmailCode, getEmailVerifyCodeCheck } from '@/services/common';
import { postUserRegister } from '@/services/user';
import { registerTplTypeEnum } from '@/enums/user';
import styles from './style.less';
import EmailForm from './components/Register/EmailForm';
import TipsInfo from './components/Register/TipsInfo';
import AccountInfoForm from './components/Register/AccountInfoForm';
import PasswordForm from './components/Register/PasswordForm';
import Success from './components/Register/Success';
import Header from './components/Register/header';

const { Step } = Steps;
const { Content } = Layout;

const Register = props => {
  const { className, location, form } = props;
  const { encryptionKey, companyType: companyTypeForQuery } = location.query;

  const [companyType, setCompanyType] = useState(companyTypeForQuery);
  const [currentStep, setCurrentStep] = useState(-1);
  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [clearTipsLoading, setClearTipsLoading] = useState(1);

  const sendEmailCode = ({ registerEmail, companyType: type }, onSuccess) => {
    // 验证码类型 0：注册 1:修改 2：找回密码
    const params = {
      verifyCodeType: '0',
      // 公司类型 0.供应商 1.采购商 注册时必传
      companyType: type,
      email: registerEmail,
    };
    setEmailLoading(true);
    postSendEmailCode(params).then(res => {
      setEmailLoading(false);
      if (res.success) {
        if (onSuccess) {
          onSuccess(res);
        }
      } else {
        setClearTipsLoading(clearTipsLoading + 1);
      }
    });
  };

  useEffect(() => {
    const { email: emailByQuery } = location.query;

    if (encryptionKey) {
      // 判断是否过期
      getEmailVerifyCodeCheck({
        code: encryptionKey,
        email: emailByQuery,
        templateType: registerTplTypeEnum.REGISTERED_EMAIL,
        deleteCode: false,
      }).then(res => {
        const { success } = res;
        if (success) {
          // 邮件认证成功，进入信息完善页
          setCurrentStep(1);
        } else {
          // 进入过期页
          router.replace('/expire');
        }
      });

      // 检测是否过期
    } else {
      setCurrentStep(0);
    }
    if (emailByQuery) {
      setEmail(emailByQuery);
    }
  }, []);
  const handleEmailFormSubmit = values => {
    const { email: registerEmail, type } = values;
    sendEmailCode({ registerEmail, companyType: type }, () => {
      setCompanyType(type);
      setEmail(registerEmail);
    });
  };
  const handleChangeEmail = () => {
    setEmail('');
  };

  const handleReSend = () => {
    sendEmailCode({ registerEmail: email, companyType });
  };
  const handleSubmit = () => {
    form.validateFields((error, values) => {
      if (!error) {
        const params = {
          ...values,
          email,
          companyType,
          encryptionKey,
        };
        postUserRegister(params).then(res => {
          if (res.success) {
            // 注册成功， 提示并跳到登录页
            setCurrentStep(2);
          }
        });
      }
    });
  };
  const renderForm = () => {
    switch (currentStep) {
      case 0:
        if (email) {
          return (
            <TipsInfo
              onChangeEmailClick={handleChangeEmail}
              onResend={handleReSend}
              clearLoading={clearTipsLoading}
              eMail={email}
            />
          );
        }
        return <EmailForm onSuccess={handleEmailFormSubmit} loading={emailLoading} />;
      case 1:
        return (
          <>
            <div className={styles.accountInfo}>
              {formatMessage({ id: 'page.register.label.account' })} <strong>{email}</strong>
            </div>
            <h1 className={styles.title}>{formatMessage({ id: 'page.register.tab.password' })}</h1>
            <PasswordForm eMail={email} form={form} />
            <h1 className={styles.title}>{formatMessage({ id: 'page.register.tab.company' })}</h1>
            <AccountInfoForm eMail={email} form={form} companyType={companyType} />
            <Button type='primary' onClick={handleSubmit} className={styles.buttonSubmit}>
              {formatMessage({ id: 'page.register.button.confirm' })}
            </Button>
          </>
        );

      case 2:
        return <Success />;

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
          <Step title={formatMessage({ id: 'page.register.step.createAccount' })} />
          <Step title={formatMessage({ id: 'page.register.step.accounted' })} />
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
