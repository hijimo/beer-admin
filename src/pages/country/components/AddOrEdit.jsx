import React, { useState, useEffect, useCallback } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import _map from 'lodash/map';
import _get from 'lodash/get';
import useData from '@common/hooks/useData';
import UploadList from '@common/components/UploadList';
import { putUpdate, postCreate } from '@/services/country';
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
        const pic = _get(values, 'picModel[0]');
        const params = {
          ...values,
          picModel: {
            id: _get(pic, 'id') || null,
            uid: _get(pic, 'uid'),
            size: _get(pic, 'size'),
            name: _get(pic, 'name'),
            type: _get(pic, 'type'),
            url: _get(pic, 'url'),
          },
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

        <Form.Item label='国家名称'>
          {getFieldDecorator('name', {
            initialValue: currItem.name || '',
            rules: [
              {
                required: true,
                message: '国家名称不能为空',
              },
            ],
          })(<Input maxLength={120} placeholder='请输入国家名称' />)}
        </Form.Item>
        <Form.Item label='国旗图片'>
          {getFieldDecorator('picModel', {
            validateFirst: true,
            initialValue: currItem.picModel || [],
            rules: [
              {
                required: true,
                message: '请上传国旗',
              },
            ],
          })(
            <UploadList
              accpet='.jpg, .png,.jpeg,.doc,.docx,.pdf'
              maxLength={1}
              maxSize={5120}
              listType='picture-card'
            />,
          )}
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
