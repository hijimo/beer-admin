import React, { useState, useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, Select, message } from 'antd';
// import { Modal, Form, Input, Select, TreeSelect, message } from 'antd';
import { emailReg } from '@/utils/common';
import {postAddUser,putEditUser} from '@/services/user'
// import { getDeptList } from '@/services/deptManage';
import { getRoleList } from '@/services/roleManage';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { Option } = Select;

const AddOrEditUser = props => {
  const {currItem = {}} = props
  // const [depOpt, setDepOpt] = useState([]);
  const [roleOpt, setRoleOpt] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          
        };
        if (props.currId) {
          params.userId = props.currId;
        }
        const api = props.currId ? putEditUser : postAddUser
        api(params).then(res => {
            message.success(formatMessage({ id: 'yeeorder.success' }));
            props.getDataList();
            props.form.resetFields();
            props.hideModal();
          
        });
      }
    });
  };

  const cancelSave = () => {
    props.form.resetFields();
    props.hideModal();
  };

  const { getFieldDecorator } = props.form;
  const { visible } = props;

  return (
    <Modal
      width={600}
      title={
        props.currId
          ? formatMessage({ id: 'page.user.label.edit.user' })
          : formatMessage({ id: 'page.user.label.add.user' })
      }
      visible={visible}
      onOk={handleSubmit}
      onCancel={cancelSave}
      okText={formatMessage({ id: 'yeeorder.Confirm' })}
      cancelText={formatMessage({ id: 'yeeorder.Cancel' })}
    >
      <Form {...formItemLayout}>
        <Form.Item label='用户名'>
          {getFieldDecorator('username', {
            initialValue: currItem.username || '',
            rules: [
              {
                required: true,
                message: '用户名不能为空'
              },
            ],
          })(
            <Input
              maxLength={20}
              placeholder='请输入用户名'
            />,
          )}
        </Form.Item>
        <Form.Item label='真实姓名'>
          {getFieldDecorator('realName', {
            initialValue: currItem.realName || '',
            rules: [
              {
                required: true,
                message: '真实姓名不能为空',
              },
            ],
          })(
            <Input
              maxLength={20}
              placeholder='请输入用户真实姓名'
            />,
          )}
        </Form.Item>
        <Form.Item label='密码'>
          {getFieldDecorator('password', {
            rules: [
              {
                required: props.currId === undefined ? true : false,
                message: '密码不能为空',
              },
            ],
          })(
            <Input
            disabled={!!props.currId}
              maxLength={100}
              type='password'
              placeholder='请输入用户密码'
            />,
          )}
        </Form.Item>

        <Form.Item label='邮箱'>
          {getFieldDecorator('email', {
            initialValue: currItem.email || '',
            rules: [
              {
                required: true,
                message: '邮箱不能为空',
              },
            ],
          })(
            <Input
              maxLength={20}
              placeholder='请输入邮箱'
            />,
          )}
        </Form.Item>


        <Form.Item label='手机'>
          {getFieldDecorator('mobile', {
            initialValue: currItem.mobile || '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'page.user.label.user.mobile.placholder' }),
              },
              {
                pattern: /^(\+)?((\d)+(-)*)+$/,
                message: formatMessage({ id: 'page.user.label.user.mobile.placholder.tip' }),
              },
            ],
          })(
            <Input
              maxLength={20}
              placeholder='请输入手机号'
            />,
          )}
        </Form.Item>
        {/* <Form.Item label={formatMessage({ id: 'page.user.label.user.dept' })}>
          {getFieldDecorator('deptNo', {
            initialValue: currItem.deptNo || undefined,
          })(
            <TreeSelect
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              placeholder={formatMessage({ id: 'page.user.label.user.dept.placholder' })}
              allowClear
              treeData={depOpt}
              showCheckedStrategy='SHOW_ALL'
              treeDefaultExpandAll
              // treeNodeLabelProp='deptName'
              maxTagCount={5}
              // treeNodeFilterProp='deptNo'
            />,
          )}
        </Form.Item> */}
        <Form.Item label={formatMessage({ id: 'page.user.label.user.role' })} style={{display:'none'}}>
          {getFieldDecorator('roleId', {
            initialValue:"72"
              
          })(
          <Input />
          )}
        </Form.Item>
        <Form.Item label='性别' style={{display:'none'}}>
          {getFieldDecorator('ssex', {
            initialValue:0
              
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label='状态' style={{display:'none'}}>
          {getFieldDecorator('status', {
            initialValue:1
              
          })(
            <Input />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(AddOrEditUser);
