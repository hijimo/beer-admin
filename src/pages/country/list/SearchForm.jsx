import React, { useCallback } from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import _map from 'lodash/map';
import useData from '@common/hooks/useData';
import { getList } from '@/services/store';

const { Item: FormItem } = Form;

const { Option } = Select;
const SearchForm = props => {
  const {
    onSearch,
    form: { getFieldDecorator, resetFields, getFieldsValue },
  } = props;

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

  const handleReset = () => {
    resetFields();
    onSearch(getFieldsValue());
  };

  const handleSearch = () => onSearch(getFieldsValue());

  return (
    <Form layout='inline' className='tableListForm'>
      <Row gutter={{ md: 8, lg: 24, xl: 24 }}>
        <Col md={8} sm={24}>
          <Form.Item label='所属门店'>
            {getFieldDecorator('storeId')(
              <Select placeholder='请选择门店' allowClear>
                {_map(records, t => (
                  <Option key={t.id} value={t.id}>
                    {t.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label='国家名称'>
            {getFieldDecorator('name')(
              <Input allowClear placeholder='请输入国家名称' autoComplete='off' />,
            )}
          </FormItem>
        </Col>
      </Row>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ float: 'right', marginBottom: 24 }}>
          <Button type='primary' onClick={handleSearch}>
            {formatMessage({ id: 'yeeorder.search' })}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
            {formatMessage({ id: 'yeeorder.reset' })}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default Form.create()(SearchForm);
