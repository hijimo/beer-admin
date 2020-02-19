import React, { useCallback, useState, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import _map from 'lodash/map';
import _get from 'lodash/get';
import useData from '@common/hooks/useData';
import { getList } from '@/services/store';

const { Item: FormItem } = Form;

const { Option } = Select;
const ColumnForm = props => {
  const { form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  const [columnList, setColumnList] = useState([]);
  // useEffect(()=>{
  //   setColumnList(value)
  // }, [value])

  const handleColumnAdd = e => {
    columnList.push({
      color: '',
      ename: '',
      cname: '',
      bg: '',
    });
    setColumnList(JSON.parse(JSON.stringify(columnList)));
  };

  return (
    <>
      <Button onClick={handleColumnAdd}>添加列</Button>
      <Form {...formItemLayout} layout='vertical'>
        {_map(columnList, (it, idx) => (
          <>
            <Row gutter={16}>
              <Col xxl={6} lg={12} md={12} sm={24}>
                <Form.Item label='前景色'>
                  {getFieldDecorator(`columnsModel[${idx}].color`, {
                    initialValue: columnList[`${idx}`].color || '',
                  })(<Input placeholder='请输入前景色' />)}
                </Form.Item>
                <Form.Item label='中文名'>
                  {getFieldDecorator(`columnsModel[${idx}].cname`, {
                    initialValue: columnList[`${idx}`].cname || '',
                  })(<Input placeholder='请输入中文名' />)}
                </Form.Item>
                <Form.Item label='英文名'>
                  {getFieldDecorator(`columnsModel[${idx}].ename`, {
                    initialValue: columnList[`${idx}`].ename || '',
                  })(<Input placeholder='请输入前景色' />)}
                </Form.Item>
                <Form.Item label='占用宽度'>
                  {getFieldDecorator(`columnsModel[${idx}].width`, {
                    initialValue: columnList[`${idx}`].width || '',
                  })(<Input placeholder='请输入占用宽度' />)}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label='背景图片'>
              {getFieldDecorator(`columnsModel[${idx}].bg`, {
                validateFirst: true,
                initialValue: columnList[`${idx}`].bg || [],
              })(
                <UploadList
                  accpet='.jpg, .png,.jpeg'
                  maxLength={1}
                  maxSize={1024}
                  listType='picture-card'
                />,
              )}
            </Form.Item>
          </>
        ))}
      </Form>
    </>
  );
};

export default Form.create()(ColumnForm);
