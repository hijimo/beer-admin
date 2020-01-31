import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import _map from 'lodash/map';
import _get from 'lodash/get';
import useData from '@common/hooks/useData';
import UploadList from '@common/components/UploadList';
import { putUpdate, postCreate } from '@/services/rank';
import { getList } from '@/services/store';
import { getList as getGoodsList } from '@/services/goods';

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
  const { form, visible, currItem = {} } = props;
  const { getFieldDecorator, getFieldValue } = form;

  const timer = useRef(-1);

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

  const [goodsList, setGoodsList] = useState([]);

  const fetchGoodsList = (opts = {}) => {
    const { storeId, productId, prodctName } = opts;
    getGoodsList({ storeId, pageSize: 10, id: productId, name: prodctName }).then(res => {
      const { data } = res;
      if (data && data.records) {
        setGoodsList(_get(data, 'records'));
      }
    });
  };

  const handleStoreIdChange = value => {
    fetchGoodsList({
      storeId: value,
    });
  };
  const handleGoodsSearch = value => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetchGoodsList({
        storeId: getFieldValue('storeId') || undefined,
        prodctName: value,
      });
    }, 600);
  };

  useEffect(() => {
    const { storeId, productId } = currItem || {};
    if (storeId && productId) {
      fetchGoodsList({ storeId, productId });
    }
  }, [currItem]);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
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
          form.resetFields();
          props.hideModal();
        });
      }
    });
  };

  const cancelSave = () => {
    form.resetFields();
    props.hideModal();
  };

  console.log('goodsList:', goodsList);
  return (
    <Modal
      width={600}
      title={currItem && currItem.id ? '编辑' : '添加'}
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
            <Select
              placeholder='请选择门店'
              onChange={(value, options) => {
                handleStoreIdChange(value, options);
              }}
              allowClear
            >
              {_map(records, t => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label='商品'>
          {getFieldDecorator('productId', {
            initialValue: currItem.productId || '',
            rules: [
              {
                required: true,
                message: '商品不能为空',
              },
            ],
          })(
            <Select
              placeholder='请选择商品'
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleGoodsSearch}
              allowClear
              showSearch
            >
              {_map(goodsList, t => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label='排行'>
          {getFieldDecorator('value', {
            initialValue: currItem.value || 0,
          })(<InputNumber min={0} placeholder='排序值，默认为0' />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(AddOrEdit);
