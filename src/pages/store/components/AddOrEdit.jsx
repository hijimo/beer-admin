import React, { useState, useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, message } from 'antd';
import { emailReg } from '@/utils/common';
import {putUpdate , postCreate} from '@/services/store'

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


const AddOrEdit = props => {
  const {currItem = {}} = props

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
        };
        if (currItem && currItem.id) {
          params.id = currItem.id;
        }
        const api = currItem.id ? putUpdate : postCreate
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
        props.currItem && props.currItem.id ? '编辑': '添加'
      }
      visible={visible}
      onOk={handleSubmit}
      onCancel={cancelSave}
      okText={formatMessage({ id: 'yeeorder.Confirm' })}
      cancelText={formatMessage({ id: 'yeeorder.Cancel' })}
    >
      <Form {...formItemLayout}>
        <Form.Item label='门店名称'>
          {getFieldDecorator('name', {
            initialValue: currItem.name || '',
            rules: [
              {
                required: true,
                message: '门店名称不能为空'
              },
            ],
          })(
            <Input
              maxLength={120}
              placeholder='请输入门店名称'
            />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(AddOrEdit);
