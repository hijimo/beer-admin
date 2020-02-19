import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, InputNumber, Select, message, Card, Row, Col, Button } from 'antd';
import _map from 'lodash/map';
import _get from 'lodash/get';
import TextArea from '@common/components/TextArea/TextArea';
import useData from '@common/hooks/useData';
import UploadList from '@common/components/UploadList';
import { putUpdate, postCreate } from '@/services/decoration';
import { getList } from '@/services/store';
import styles from './style.less';

const pageEnums = [
  { label: '选择分类页', value: 1 },
  { label: '品牌国家页', value: 2 },
  { label: '排行页', value: 3 },
  { label: '商品列表页', value: 4 },
  { label: '商品详情页', value: 5 },
];

const { Option } = Select;

const formItemLayout = {
  // labelCol: {
  //   xs: { span: 24 },
  //   sm: { span: 6 },
  // },
  // wrapperCol: {
  //   xs: { span: 24 },
  //   sm: { span: 16 },
  // },
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
  const { currItem = {}, visible, form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, setFields } = form;

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

  const keyRef = useRef(0);

  getFieldDecorator('columnsModelKey', { initialValue: [] });

  useEffect(() => {
    if (currItem && currItem.columnsModel) {
      setFieldsValue({
        columnsModelKey: _map(currItem.columnsModel, (it, idx) => idx),
      });
      keyRef.current = currItem.columnsModel.length;
    }
  }, [currItem]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const pic = _get(values, 'bgModel[0]');
        const pic2 = _get(values, 'titleBgModel[0]');
        const pic3 = _get(values, 'img1Model[0]');
        const pic4 = _get(values, 'img2Model[0]');
        const pic5 = _get(values, 'primaryBtnBgModel[0]');
        const pic6 = _get(values, 'title1BgModel[0]');
        const getColumnsModel = () => {
          const columnsModel = _map(_get(values, 'columnsModelKey'), (key, idx) => ({
            color: _get(values, `columnsModelColor[${key}]`),
            cname: _get(values, `columnsModelCname[${key}]`),
            ename: _get(values, `columnsModelEname[${key}]`),
            width: _get(values, `columnsModelWidth[${key}]`),
            bg: _map(_get(values, `columnsModelBg[${key}]`), file => getFileModel(file)),
          }));

          return columnsModel ? JSON.stringify(columnsModel) : '';
        };

        const params = {
          ...values,
          columns: getColumnsModel(),
          bgModel: getFileModel(pic),
          titleBgModel: getFileModel(pic2),
          img1Model: getFileModel(pic3),
          img2Model: getFileModel(pic4),
          primaryBtnBgModel: getFileModel(pic5),
          title1BgModel: getFileModel(pic6),
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

  const handleColumnAdd = e => {
    let columnsModel = getFieldValue('columnsModel');
    if (!columnsModel || !columnsModel.push) {
      columnsModel = [];
    }

    const enums = {
      columnsModelKey: () => {
        keyRef.current += 1;
        return keyRef.current;
      },
      columnsModelBg: () => [],
    };
    const getAddValue = key => {
      const oldValue = getFieldValue(key);
      let b = enums[key] ? enums[key]() : '';
      console.log(key, ':', [].concat([], oldValue, [b]));
      return [].concat([], oldValue, [b]);
    };
    form.setFieldsValue({
      columnsModelKey: getAddValue('columnsModelKey'),
    });
  };
  const handleColumnRemove = (e, key) => {
    // can use data-binding to get
    const keys = getFieldValue('columnsModelKey');

    form.setFieldsValue({
      columnsModelKey: keys.filter(k => key !== k),
    });
  };

  const cancelSave = () => {
    props.form.resetFields();
    props.hideModal();
  };

  const renderColumns = () => {
    const columnsModelForm = getFieldValue('columnsModelKey');
    return _map(columnsModelForm, (key, idx) => (
      <div key={key} style={{ border: 'solid 1px #ccc', marginBottom: 15, padding: 5 }}>
        <Button
          onClick={e => {
            handleColumnRemove(e, key);
          }}
        >
          删除该列
        </Button>
        <Row gutter={16}>
          <Col xxl={6} lg={12} md={12} sm={24}>
            <Form.Item label='前景色'>
              {getFieldDecorator(`columnsModelColor[${key}]`, {
                initialValue: _get(currItem, `columnsModel[${key}].color`) || '',
              })(<Input placeholder='请输入前景色' />)}
            </Form.Item>
            <Form.Item label='中文名'>
              {getFieldDecorator(`columnsModelCname[${key}]`, {
                initialValue: _get(currItem, `columnsModel[${key}].cname`) || '',
              })(<Input placeholder='请输入中文名' />)}
            </Form.Item>
            <Form.Item label='英文名'>
              {getFieldDecorator(`columnsModelEname[${key}]`, {
                initialValue: _get(currItem, `columnsModel[${key}].ename`) || '',
              })(<Input placeholder='请输入英文名' />)}
            </Form.Item>
            <Form.Item label='占用宽度'>
              {getFieldDecorator(`columnsModelWidth[${key}]`, {
                initialValue: _get(currItem, `columnsModel[${key}].width`) || '',
              })(<Input placeholder='请输入占用宽度' />)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='背景图片'>
          {getFieldDecorator(`columnsModelBg[${key}]`, {
            validateFirst: true,
            initialValue: _get(currItem, `columnsModel[${idx}].bg`) || [],
          })(
            <UploadList
              accpet='.jpg, .png,.jpeg'
              maxLength={1}
              maxSize={1024}
              listType='picture-card'
            />,
          )}
        </Form.Item>
      </div>
    ));
  };

  return (
    <Modal
      width='80%'
      // title={currItem && currItem.id ? '编辑' : '添加'}
      visible={visible}
      className={styles.modal}
      onOk={handleSubmit}
      onCancel={cancelSave}
      okText={formatMessage({ id: 'yeeorder.Confirm' })}
      cancelText={formatMessage({ id: 'yeeorder.Cancel' })}
    >
      <Card title='所属信息' className={styles.card} bordered={false}>
        <Form {...formItemLayout} layout='vertical'>
          <Row gutter={16}>
            <Col xxl={6} lg={12} md={12} sm={24}>
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
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='所属页面'>
                {getFieldDecorator('page', {
                  initialValue: currItem.page || '',
                  rules: [
                    {
                      required: true,
                      message: '所属页面不能为空',
                    },
                  ],
                })(
                  <Select placeholder='请选择所属页面' allowClear>
                    {_map(pageEnums, t => (
                      <Option key={t.value} value={t.value}>
                        {t.label}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title='标题信息' className={styles.card} bordered={false}>
        <Form {...formItemLayout} layout='vertical'>
          <Row gutter={16}>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='标题'>
                {getFieldDecorator('title', {
                  initialValue: currItem.title || '',
                })(<Input maxLength={120} placeholder='请输入标题' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='标题字体颜色'>
                {getFieldDecorator('titlecolor', {
                  initialValue: currItem.titlecolor || '',
                })(<Input maxLength={120} placeholder='请输入字体颜色' />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label='标题背景图'>
            {getFieldDecorator('titleBgModel', {
              validateFirst: true,
              initialValue: currItem.titleBgModel || [],
            })(
              <UploadList
                accpet='.jpg, .png,.jpeg'
                maxLength={1}
                maxSize={5120}
                listType='picture-card'
              />,
            )}
          </Form.Item>

          {[2, 5].includes(getFieldValue('page')) && (
            <>
              <Row gutter={16}>
                <Col xxl={6} lg={12} md={12} sm={24}>
                  <Form.Item label='标题2'>
                    {getFieldDecorator('title1', {
                      initialValue: currItem.title1 || '',
                    })(<Input maxLength={120} placeholder='请输入标题2' />)}
                  </Form.Item>
                </Col>
                <Col xxl={6} lg={12} md={12} sm={24}>
                  <Form.Item label='标题2字体颜色'>
                    {getFieldDecorator('title1color', {
                      initialValue: currItem.title1color || '',
                    })(<Input maxLength={120} placeholder='请输入标题2字体颜色' />)}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label='标题2背景图'>
                {getFieldDecorator('title1BgModel', {
                  validateFirst: true,
                  initialValue: currItem.title1BgModel || [],
                })(
                  <UploadList
                    accpet='.jpg, .png,.jpeg'
                    maxLength={1}
                    maxSize={5120}
                    listType='picture-card'
                  />,
                )}
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
      <Card title='页面信息' className={styles.card} bordered={false}>
        <Form {...formItemLayout} layout='vertical'>
          <Row gutter={16}>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='前景色'>
                {getFieldDecorator('color', {
                  initialValue: currItem.color || '',
                })(<Input placeholder='请输入前景色' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='辅助色1'>
                {getFieldDecorator('color1', {
                  initialValue: currItem.color1 || '',
                })(<Input placeholder='请输入辅助色1' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='辅助色2'>
                {getFieldDecorator('color2', {
                  initialValue: currItem.color2 || '',
                })(<Input placeholder='请输入辅助色1' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='辅助色3'>
                {getFieldDecorator('color3', {
                  initialValue: currItem.color3 || '',
                })(<Input placeholder='请输入辅助色3' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='辅助色4'>
                {getFieldDecorator('color4', {
                  initialValue: currItem.color4 || '',
                })(<Input placeholder='请输入辅助色4' />)}
              </Form.Item>
            </Col>
          </Row>

          {[2].includes(getFieldValue('page')) && (
            <Form.Item label='主按钮背景'>
              {getFieldDecorator('primaryBtnBgModel', {
                validateFirst: true,
                initialValue: currItem.primaryBtnBgModel || [],
              })(
                <UploadList
                  accpet='.jpg, .png,.jpeg'
                  maxLength={1}
                  maxSize={1024}
                  listType='picture-card'
                />,
              )}
            </Form.Item>
          )}

          <Form.Item label='背景图片'>
            {getFieldDecorator('bgModel', {
              validateFirst: true,
              initialValue: currItem.bgModel || [],
            })(
              <UploadList
                accpet='.jpg, .png,.jpeg'
                maxLength={1}
                maxSize={1024}
                listType='picture-card'
              />,
            )}
          </Form.Item>
          <Form.Item label='装饰图片1'>
            {getFieldDecorator('img1Model', {
              validateFirst: true,
              initialValue: currItem.img1Model || [],
            })(
              <UploadList
                accpet='.jpg, .png,.jpeg'
                maxLength={1}
                maxSize={1024}
                listType='picture-card'
              />,
            )}
          </Form.Item>
          <Form.Item label='装饰图片2'>
            {getFieldDecorator('img2Model', {
              validateFirst: true,
              initialValue: currItem.img2Model || [],
            })(
              <UploadList
                accpet='.jpg, .png,.jpeg'
                maxLength={1}
                maxSize={1024}
                listType='picture-card'
              />,
            )}
          </Form.Item>
        </Form>
      </Card>

      {getFieldValue('page') === 4 ? (
        <Card title='列信息' className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='空列表文案'>
                {getFieldDecorator('emptyTitle', {
                  initialValue: currItem.emptyTitle || '',
                })(<Input placeholder='请输入空列表文案' />)}
              </Form.Item>
            </Col>
          </Row>
          <Button onClick={handleColumnAdd} style={{ marginBottom: 10 }}>
            添加列
          </Button>
          <Form {...formItemLayout} layout='vertical'>
            {renderColumns()}
          </Form>
        </Card>
      ) : null}
    </Modal>
  );
};

export default Form.create()(AddOrEdit);
