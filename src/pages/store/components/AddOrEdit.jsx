import React, { useState, useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, message, InputNumber } from 'antd';
import _get from 'lodash/get';
import UploadList from '@common/components/UploadList';
import TextArea from '@common/components/TextArea/TextArea';
import { emailReg } from '@/utils/common';
import { putUpdate, postCreate } from '@/services/store';

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

const getFileModel = file =>
  file
    ? {
        id: _get(file, 'id') || null,
        uid: _get(file, 'uid'),
        size: _get(file, 'size'),
        name: _get(file, 'name'),
        type: _get(file, 'type'),
        url: _get(file, 'url'),
      }
    : null;
const AddOrEdit = props => {
  const { currItem = {} } = props;

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const pic = _get(values, 'musicModel[0]');
        const pic1 = _get(values, 'backModel[0]');

        const params = {
          ...values,
          musicModel: getFileModel(pic),
          backModel: getFileModel(pic1),
        };
        if (currItem && currItem.id) {
          params.id = currItem.id;
        }
        const api = currItem.id ? putUpdate : postCreate;
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
      title={props.currItem && props.currItem.id ? '编辑' : '添加'}
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
                message: '门店名称不能为空',
              },
            ],
          })(<Input maxLength={120} placeholder='请输入门店名称' />)}
        </Form.Item>
        <Form.Item label='屏幕指引文案'>
          {getFieldDecorator('text1', {
            initialValue: currItem.text1 || '',
          })(<TextArea rows={2} maxLength={120} placeholder='请输入屏幕指引文案' />)}
        </Form.Item>
        <Form.Item label='返回按钮背景'>
          {getFieldDecorator('backModel', {
            validateFirst: true,
            initialValue: currItem.backModel || [],
          })(
            <UploadList
              accpet='.jpg, .png,.jpeg'
              maxLength={1}
              maxSize={5120}
              listType='picture-card'
            />,
          )}
        </Form.Item>
        <Form.Item label='返回首页时间(秒)'>
          {getFieldDecorator('second', {
            initialValue: currItem.second || '',
          })(<InputNumber placeholder='请输入返回首页时间(秒' />)}
        </Form.Item>
        <Form.Item label='商品页默认音频'>
          {getFieldDecorator('musicModel', {
            validateFirst: true,
            initialValue: currItem.musicModel || [],
          })(<UploadList accpet='.mp3' maxLength={1} maxSize={5120} listType='picture-card' />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(AddOrEdit);
