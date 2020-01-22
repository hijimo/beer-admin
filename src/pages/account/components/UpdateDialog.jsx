import { Modal, Form, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { PureComponent } from 'react';
import {
  updateUserEmail,
  updateUserName,
  updateUserPhone,
} from '@/services/account';

import {putEditPwd,putEditUser} from '@/services/user'
import {getUser} from '@/utils/ls'
import ModifyName from './ModifyName';
import ModifyEmail from './ModifyEmail';
import ModifyTel from './ModifyTel';
import ModifyPsw from './ModifyPsw';

const dialogType = {
  userName: 'userName',
  email: 'email',
  mobile: 'mobile',
  password: 'password',
};
const titleMap = {
  [dialogType.userName]: 'app.account.modify-English-name',
  [dialogType.email]: 'app.account.modify-email',
  [dialogType.mobile]: 'app.account.modify-telephone',
  [dialogType.password]: 'app.account.modify-password',
};

class UpdateDialog extends PureComponent {
  handleCancel = () => {
    const { resetFields } = this.props.form;
    this.props.hideDialog();
    resetFields();
  };

  getTitle = () => {
    const { type } = this.props;
    const id = titleMap[type] || 'app.account.modify';
    return formatMessage({ id });
  };
  getUserInfo = () => {
    const u = getUser()

    return {
      username: u.username,
      userId: u.userId,
      roleId: u.roleId,
      status: u.status,
      ssex: u.ssex,
      mobile: u.mobile,
      email: u.email,
      realName: u.realName,
    }
  }
  handleOk = event => {
    event.preventDefault();
    const { form, type } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (type === dialogType.userName) {
          this.handleModifyName(values);
        }
        if (type === dialogType.email) {
          this.handleChangeUserEmail(values);
        }
        if (type === dialogType.password) {
          this.handleChangePassword(values);
        }
        if (type === dialogType.mobile) {
          this.handleChangeMobile(values);
        }
      }
    });
  };

  handleChangeMobile(values) {
    
    putEditUser({
     ... this.getUserInfo(),
      ...values,
    }).then(( res) => {
      
        message.success('success');
        setTimeout(()=>{
          window.location.reload()
        }, 1500)
      
    });
  }

  handleChangePassword({ oldPassword, userPassword }) {
    const u = getUser()
    putEditPwd({ username: u.username, password:userPassword }).then((res) => {
        message.success('success');
        setTimeout(()=>{
          window.location = '/user/login'
        }, 1500)
        // todo需要跳转到登录页重新登录
      })
  }

  handleChangeUserEmail(values) {
    putEditUser({
      ... this.getUserInfo(),
       ...values,
     }).then(( res) => {
       
         message.success('success');
         setTimeout(()=>{
           window.location.reload()
         }, 1500)
       
     });
  }

  handleModifyName(values) {
    putEditUser({
      ... this.getUserInfo(),
       ...values,
     }).then(( res) => {
       
         message.success('success');
         setTimeout(()=>{
           window.location.reload()
         }, 1500)
       
     });
  }

  fetchUserInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  render() {
    const { visible, form, type } = this.props;
    const title = this.getTitle();
    let formContent = null;
    if (type === dialogType.userName) {
      formContent = <ModifyName form={form} />;
    } else if (type === dialogType.email) {
      formContent = <ModifyEmail form={form} />;
    } else if (type === dialogType.mobile) {
      formContent = <ModifyTel form={form} />;
    } else if (type === dialogType.password) {
      formContent = <ModifyPsw form={form} />;
    }
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <Form {...formItemLayout} layout='horizontal' hideRequiredMark>
          {formContent}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UpdateDialog);
