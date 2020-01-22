import { Button, Form, Input, Row, Col, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { emailVerifyCode } from '@/services/account';
import { pswValidator } from '@/utils/utils';

const FormItem = Form.Item;
const { Password } = Input;
const formFiredsKeys = {
  email: 'userEmail',
  verifyCode: 'verifyEmailCode',
  password: 'userPassword',
  sendCode: 'sendCode',
};

class ModifyEmail extends Component {
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
      email: [
        {
          required: true,
          message: formatMessage({ id: 'app.account.email-empty-message' }),
        },
        {
          type: 'email',
          message: formatMessage({ id: 'app.account.email-format-error-message' }),
        },
      ],
    
    };

    return (
      <Fragment>
        <FormItem
          label='邮箱'
        >
          {getFieldDecorator('email', {
            rules: rules.email,
          })(<Input placeholder={formatMessage({ id: 'yeeorder.please-input' })} />)}
        </FormItem>
      </Fragment>
    );
  }
}

export default Form.create()(ModifyEmail);
