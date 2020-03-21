import React, { useState, useEffect, useCallback } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, InputNumber, Select, message, Card, Row, Col } from 'antd';
import _map from 'lodash/map';
import _get from 'lodash/get';
import TextArea from '@common/components/TextArea/TextArea';
import useData from '@common/hooks/useData';
import UploadList from '@common/components/UploadList';
import { putUpdate, postCreate } from '@/services/goods';
import { getList } from '@/services/store';
import { getList as getCategoryList } from '@/services/category';
import { getList as getCountryList } from '@/services/country';
import styles from './style.less';

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

const { Option } = Select;

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

  const [categoryList, setCategoryList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const handleStoreIdChange = value => {
    getCategoryList({ storeId: value, pageSize: 999 }).then(res => {
      const { data } = res;
      if (data && data.records) {
        setCategoryList(_get(data, 'records'));
      }
    });
    getCountryList({ storeId: value, pageSize: 999 }).then(res => {
      const { data } = res;
      if (data && data.records) {
        setCountryList(_get(data, 'records'));
      }
    });
  };

  useEffect(() => {
    const { storeId } = currItem || {};
    if (storeId) {
      handleStoreIdChange(storeId);
    }
  }, [currItem]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const pic = _get(values, 'mainPicModel[0]');
        const pic2 = _get(values, 'thumbPicModel[0]');
        const pic3 = _get(values, 'shelfPicModel[0]');
        const pic4 = _get(values, 'videoFileModel[0]');

        const params = {
          ...values,
          mainPicModel: getFileModel(pic),
          thumbPicModel: getFileModel(pic2),
          shelfPicModel: getFileModel(pic3),
          videoFileModel: getFileModel(pic4),
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
                  <Select
                    placeholder='请选择门店'
                    allowClear
                    onChange={(value, options) => {
                      handleStoreIdChange(value, options);
                    }}
                  >
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
              <Form.Item label='商品分类'>
                {getFieldDecorator('categoryId', {
                  initialValue: currItem.categoryId || '',
                  rules: [
                    {
                      required: true,
                      message: '商品分类不能为空',
                    },
                  ],
                })(
                  <Select placeholder='请选择商品分类' allowClear>
                    {_map(categoryList, t => (
                      <Option key={t.id} value={t.id}>
                        {t.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='所在国家'>
                {getFieldDecorator('country', {
                  initialValue: currItem.country || '',
                  rules: [
                    {
                      required: true,
                      message: '所在国家不能为空',
                    },
                  ],
                })(
                  <Select placeholder='请选择所在国家' allowClear>
                    {_map(countryList, t => (
                      <Option key={t.id} value={t.id}>
                        {t.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title='商品信息' className={styles.card} bordered={false}>
        <Form {...formItemLayout} layout='vertical'>
          <Row gutter={16}>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='商品名称'>
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
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='商品英文名'>
                {getFieldDecorator('enName', {
                  initialValue: currItem.enName || '',
                  rules: [
                    {
                      required: true,
                      message: '商品英文名不能为空',
                    },
                  ],
                })(<Input maxLength={120} placeholder='请输入商品英文名' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='商品编码'>
                {getFieldDecorator('no', {
                  initialValue: currItem.no || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '商品编码不能为空',
                  //   },
                  // ],
                })(<InputNumber style={{ width: '100%' }} placeholder='请输入商品编码' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='价格'>
                {getFieldDecorator('price', {
                  initialValue: currItem.price || '',
                  rules: [
                    {
                      required: true,
                      message: '价格不能为空',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder='请输入价格' />)}
              </Form.Item>
            </Col>
          </Row>
          {/* <Form.Item label='商品描述'>
            {getFieldDecorator('description', {
              initialValue: currItem.description || '',
            })(<TextArea maxLength={300} rows={5} placeholder='请输入商品描述' />)}
          </Form.Item> */}
          <Form.Item label='商品主图'>
            {getFieldDecorator('mainPicModel', {
              validateFirst: true,
              initialValue: currItem.mainPicModel || [],
              rules: [
                {
                  required: true,
                  message: '请上传商品主图',
                },
              ],
            })(
              <UploadList
                accpet='.jpg, .png,.jpeg'
                maxLength={1}
                maxSize={5120}
                listType='picture-card'
              />,
            )}
          </Form.Item>
          <Form.Item label='列表缩略图'>
            {getFieldDecorator('thumbPicModel', {
              validateFirst: true,
              initialValue: currItem.thumbPicModel || [],
              rules: [
                {
                  required: true,
                  message: '请上传列表缩略图',
                },
              ],
            })(
              <UploadList
                accpet='.jpg, .png,.jpeg'
                maxLength={1}
                maxSize={1024}
                listType='picture-card'
              />,
            )}
          </Form.Item>
          <Form.Item label='商品视频'>
            {getFieldDecorator('videoFileModel', {
              validateFirst: true,
              initialValue: currItem.videoFileModel || [],
              // rules: [
              //   {
              //     required: true,
              //     message: '请上传商品视频',
              //   },
              // ],
            })(<UploadList accpet='.mp4' maxLength={1} maxSize={51200} listType='picture-card' />)}
          </Form.Item>
        </Form>
      </Card>
      <Card title='基本信息' className={styles.card} bordered={false}>
        <Form {...formItemLayout} layout='vertical'>
          <Row gutter={16}>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='品牌'>
                {getFieldDecorator('brand', {
                  initialValue: currItem.brand || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '品牌不能为空',
                  //   },
                  // ],
                })(<Input placeholder='请输入品牌' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='品牌国家'>
                {getFieldDecorator('brandCountry', {
                  initialValue: currItem.brandCountry || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '品牌国家不能为空',
                  //   },
                  // ],
                })(<Input placeholder='请输入品牌国家' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='产地'>
                {getFieldDecorator('origin', {
                  initialValue: currItem.origin || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '产地不能为空',
                  //   },
                  // ],
                })(<Input placeholder='请输入产地' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='规格'>
                {getFieldDecorator('specification', {
                  initialValue: currItem.specification || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '规格不能为空',
                  //   },
                  // ],
                })(<Input maxLength={120} placeholder='请输入规格' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='风格'>
                {getFieldDecorator('style', {
                  initialValue: currItem.style || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '风格不能为空',
                  //   },
                  // ],
                })(<Input placeholder='请输入风格' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='颜色'>
                {getFieldDecorator('color', {
                  initialValue: currItem.color || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '颜色不能为空',
                  //   },
                  // ],
                })(<Input placeholder='请输入颜色' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='酒精度'>
                {getFieldDecorator('alcohol', {
                  initialValue: currItem.alcohol || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '酒精度不能为空',
                  //   },
                  // ],
                })(<InputNumber style={{ width: '100%' }} placeholder='请输入酒精度' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='苦度'>
                {getFieldDecorator('bitterness', {
                  initialValue: currItem.bitterness || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '苦度不能为空',
                  //   },
                  // ],
                })(<InputNumber style={{ width: '100%' }} placeholder='请输入苦度' />)}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label='风味特点'>
            {getFieldDecorator('flavor', {
              initialValue: currItem.flavor || '',
              // rules: [
              //   {
              //     required: true,
              //     message: '风味特点不能为空',
              //   },
              // ],
            })(<TextArea maxLength={300} rows={5} placeholder='请输入风味特点' />)}
          </Form.Item>
        </Form>
      </Card>
      <Card title='获奖信息' className={styles.card} bordered={false}>
        <Form {...formItemLayout} layout='vertical'>
          <Row gutter={16}>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='RatebeerScore'>
                {getFieldDecorator('ratebeerScore', {
                  initialValue: currItem.ratebeerScore || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: 'RatebeerScore不能为空',
                  //   },
                  // ],
                })(<InputNumber style={{ width: '100%' }} placeholder='请输入RatebeerScore' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24}>
              <Form.Item label='获奖描述'>
                {getFieldDecorator('awards', {
                  initialValue: currItem.awards || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '获奖奖项名称不能为空',
                  //   },
                  // ],
                })(<Input maxLength={120} placeholder='请输入获奖奖项名称' />)}
              </Form.Item>
            </Col>
            <Col xxl={6} lg={12} md={12} sm={24} style={{ display: 'none' }}>
              <Form.Item label='获奖次数'>
                {getFieldDecorator('awardsCount', {
                  initialValue: currItem.awardsCount || '',
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '获奖次数不能为空',
                  //   },
                  // ],
                })(<InputNumber style={{ width: '100%' }} placeholder='请输入获奖次数' />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title='货架信息' className={styles.card} bordered={false}>
        <Form {...formItemLayout} layout='vertical'>
          <Form.Item label='货架图'>
            {getFieldDecorator('shelfPicModel', {
              validateFirst: true,
              initialValue: currItem.shelfPicModel || [],
              // rules: [
              //   {
              //     required: true,
              //     message: '请上传货架图',
              //   },
              // ],
            })(
              <UploadList
                accpet='.jpg, .png,.jpeg'
                maxLength={1}
                maxSize={5120}
                listType='picture-card'
              />,
            )}
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default Form.create()(AddOrEdit);
