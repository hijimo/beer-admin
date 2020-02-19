import React, { useState, useEffect, useCallback } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import _map from 'lodash/map';
import _get from 'lodash/get';
import TextArea from '@common/components/TextArea/TextArea';
import useData from '@common/hooks/useData';
import UploadList from '@common/components/UploadList';
import { putUpdate, postCreate } from '@/services/price';
import { getList } from '@/services/store';

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
const AddOrEdit = props => {
  const { currItem = {} } = props;

  console.log('props:', props);

  const dataLoader = useCallback(
    () =>
      getList({
        pageNum: 1,
        pageSize: 99,
        name: '',
      }),
    [],
  );
  const {
    data: { records = [] },
  } = useData(dataLoader, []);

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
        <Form.Item label='所属门店'>
          {getFieldDecorator('storeId', {
            initialValue: currItem.storeId || '',
            rules: [
              {
                required: true,
                message: '所属门店不能为空',
              },
            ],
          })(
            <Select placeholder='请选择门店' allowClear>
              {_map(records, t => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label='标签名称'>
          {getFieldDecorator('name', {
            initialValue: currItem.name || '',
            rules: [
              {
                required: true,
                message: '分类名称不能为空',
              },
            ],
          })(<Input rows={2} maxLength={120} placeholder='请输入分类名称' />)}
        </Form.Item>
        <Form.Item label='起始区间'>
          {getFieldDecorator('min', {
            initialValue: currItem.min || 0,
            rules: [
              {
                required: true,
                message: '起始区间不能为空',
              },
            ],
          })(<InputNumber min={0} placeholder='请输入价格起始区间' />)}
        </Form.Item>

        <Form.Item label='终止区间'>
          {getFieldDecorator('max', {
            initialValue: currItem.max || null,
          })(<InputNumber min={0} placeholder='请输入价格终止区间' />)}
        </Form.Item>

        <Form.Item label='排序'>
          {getFieldDecorator('sort', {
            initialValue: currItem.sort || 0,
          })(<InputNumber min={0} placeholder='排序值，默认为0' />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(AddOrEdit);
