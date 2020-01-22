import { Button, Form, Input, Row, Col, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { putUserInfo } from '@/services/user';
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
      ]
    };

    return (
      <Fragment>
        <FormItem
          label={formatMessage({
            id: 'app.account.new-telephone',
          })}
        >
          {getFieldDecorator('mobile', {
            // initialValue: userMobile,
            rules: rules.mobile,
          })(
            <Input
              autoComplete='off'
              placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            />,
          )}
        </FormItem>
        
      </Fragment>
    );
  }
}

export default Form.create()(ModifyTel);
