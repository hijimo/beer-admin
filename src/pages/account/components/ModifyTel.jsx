import { Button, Form, Input, Row, Col, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { mobileVerifyCode } from '@/services/account';
import { pswValidator } from '@/utils/utils';

const FormItem = Form.Item;
const { Password } = Input;
const formFiredsKeys = {
  mobile: 'userMobile',
  verifyCode: 'verifyMobileCode',
  password: 'userPassword',
  sendCode: 'sendCode',
};

@connect(({ user }) => ({
  userInfo: user.currentUser,
}))
class ModifyTel extends Component {
  state = {
    buttonText: formFiredsKeys.sendCode,
    btnLoading: false,
  };

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  handleClick = () => {
    const { validateFields } = this.props.form;
    validateFields([formFiredsKeys.mobile], (err, values) => {
      if (!err) {
        this.setState({
          btnLoading: true,
        });
        mobileVerifyCode({
          mobile: values[formFiredsKeys.mobile],
          verifyCodeType: 1, // 修改
        }).then(res => {
          const { success } = res;
          this.setState({
            btnLoading: false,
          });
          if (success) {
            message.success('success');
            this.countDown();
          }
        });
      }
    });
  };

  countDown = () => {
    this.setState({
      buttonText: 60,
    });
    this.timerID = setInterval(() => {
      this.tick();
    }, 1000);
  };

  tick() {
    let { buttonText } = this.state;
    buttonText -= 1;
    if (buttonText <= 0) {
      this.setState({
        buttonText: formFiredsKeys.sendCode,
      });
      clearInterval(this.timerID);
    } else {
      this.setState({ buttonText });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { buttonText, btnLoading } = this.state;

    const rules = {
      mobile: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.new-telephone-empty-message' }),
        },
        {
          pattern: /^1\d{10}$/,
          message: formatMessage({ id: 'app.account.new-telephone-format-error-message' }),
        },
      ],
      verifyCode: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.verifyCode-message' }),
        },
      ],
      password: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.account-password-message' }),
        },
        {
          validator: pswValidator,
        },
      ],
    };

    return (
      <Fragment>
        <FormItem
          label={formatMessage({
            id: 'app.account.new-telephone',
          })}
        >
          {getFieldDecorator(formFiredsKeys.mobile, {
            // initialValue: userMobile,
            rules: rules.mobile,
          })(
            <Input
              autoComplete='off'
              placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            />,
          )}
        </FormItem>
        <FormItem
          label={formatMessage({
            id: 'app.account.verifyCode',
          })}
        >
          <Row type='flex' justify='space-between'>
            <Col span={12}>
              {getFieldDecorator(formFiredsKeys.verifyCode, {
                rules: rules.verifyCode,
              })(<Input placeholder={formatMessage({ id: 'yeeorder.please-input' })} />)}
            </Col>
            <Col span={10} style={{ textAlign: 'right' }}>
              <Button
                type='primary'
                loading={btnLoading}
                onClick={this.handleClick}
                disabled={buttonText !== formFiredsKeys.sendCode}
                block
              >
                {buttonText === formFiredsKeys.sendCode
                  ? formatMessage({ id: 'yeeorder.send-code' })
                  : buttonText}
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          label={formatMessage({
            id: 'app.account.account-password',
          })}
        >
          {getFieldDecorator(formFiredsKeys.password, {
            rules: rules.password,
            validateFirst: true,
          })(<Password placeholder={formatMessage({ id: 'yeeorder.please-input' })} />)}
        </FormItem>
      </Fragment>
    );
  }
}

export default Form.create()(ModifyTel);
