import React from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Cascader,
  message,
  Radio,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Icon,
  Row,
  Col,
  TreeSelect,
  Descriptions,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import DateIn18 from '@common/components/DateIn18';
import UcharmEditor from '@common/components/UcharmEditer';
import UploadList from '@common/components/UploadList';
import _values from 'lodash/values';
import _isEmpty from 'lodash/isEmpty';
import _some from 'lodash/some';
import classNames from 'classnames';
import BottomPanel from '@/components/BottomPanel';
import { poductSubmit, poductSave } from '@/services/product';
import { addCategoryAttributeOption } from '@/services/common';
import Address from '@/components/Address';
import { regexpEngNum } from '@/utils/validate';
import styles from './index.less';

const { Option } = Select;
const InputGroup = Input.Group;
const formFieldKeys = {
  category: 'category',
  productName: 'name',
  group: 'groupIdList',
  productImages: 'multimediaInfo',
  productVideo: 'video',
  uom: 'uom',
  price: 'price',
  moq: 'moq',
  preferedIncoTerms: 'incoTerms',
  itemNo: 'itemNo',
  currency: 'currency',
  normalProductionLeadTime: 'leadTime',
  validaty: 'validity',
  chinaHsCode: 'hsCode',
  productDetail: 'detail',
  offerSample: 'sampleOfferFlag',
  offerFreeSample: 'sampleFreeFlag',
  offerUnitPrice: 'sampleUnitPrice',
  sampleUOM: 'sampleUom',
  sampleCurrency: 'sampleCurrency',
};
const MODE_READONLY = 2;
const MODE_EDIT = 1;
const NO_NEED_SAMPLE = false;
const OFFER_FREE_SAMPLE = true;
const WidgetTypeName = {
  radio: 0,
  checkbox: 1,
  dropdown: 2,
  input: 3,
  regionPicker: 4,
  datePicker: 5,
};
const CUSTOMABLE_CONTROLS = [
  WidgetTypeName.radio,
  WidgetTypeName.checkbox,
  WidgetTypeName.dropdown,
];
const GEN_SPEC_PREFIX = '__gen_pro__';
const SALE_SPEC_PREFIX = '__sale_pro__';

@connect(({ common, product }) => ({
  categoryTree: common.categoryTree || [],
  productGroup: product.productGroup || [],
  uom: common.uom || [],
  currency: common.currency || [],
  incoterm: common.incoterm || [],
  categoryAttributes: common.categoryAttributes,
}))
class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      primayPicUid: '',
      thirdCategoryId: null,
      customizeValPool: Object.create(null),
      initValueSet: false,
      initAttributes: false,
      floorNum: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'common/fetchCategory' });
    dispatch({ type: 'product/productGroupQuery' });
    dispatch({
      type: 'common/fetchDictValByKeys',
      payload: { keys: ['uom', 'currency', 'incoterm'] },
    });
    this.setFloorNum();
    window.addEventListener('resize', this.setFloorNum);
  }

  componentDidUpdate(prevProps) {
    const { detail, categoryAttributes, mode, form } = this.props;
    const { initValueSet, initAttributes } = this.state;
    if (mode === MODE_EDIT && !prevProps.detail && this.props.detail) {
      if (initValueSet) {
        return;
      }
      const { firstCategoryId, secondCategoryId, thirdCategoryId } = detail;
      form.setFieldsValue({
        [formFieldKeys.category]: firstCategoryId
          ? [firstCategoryId, secondCategoryId, thirdCategoryId]
          : undefined,
        [formFieldKeys.itemNo]: detail[formFieldKeys.itemNo],
        [formFieldKeys.productName]: detail[formFieldKeys.productName],
        [formFieldKeys.group]: detail.groupIds,
        [formFieldKeys.productImages]: detail[formFieldKeys.productImages],
        [formFieldKeys.productVideo]: detail[formFieldKeys.productVideo]
          ? [detail[formFieldKeys.productVideo]]
          : undefined,
        [formFieldKeys.uom]: detail[formFieldKeys.uom] || undefined,
        [formFieldKeys.currency]: detail[formFieldKeys.currency] || undefined,
        [formFieldKeys.price]: detail[formFieldKeys.price],
        [formFieldKeys.moq]: detail[formFieldKeys.moq],

        [formFieldKeys.offerSample]: detail[formFieldKeys.offerSample],
        [formFieldKeys.offerFreeSample]: detail[formFieldKeys.offerFreeSample],
        [formFieldKeys.offerUnitPrice]: detail[formFieldKeys.offerUnitPrice],
        // [formFieldKeys.sampleCurrency]: detail[formFieldKeys.sampleCurrency],
        [formFieldKeys.sampleUOM]: detail[formFieldKeys.sampleUOM] || undefined,

        [formFieldKeys.preferedIncoTerms]: detail[formFieldKeys.preferedIncoTerms] || undefined,
        [formFieldKeys.normalProductionLeadTime]: detail[formFieldKeys.normalProductionLeadTime],
        [formFieldKeys.validaty]:
          detail[formFieldKeys.validaty] && moment(detail[formFieldKeys.validaty]),
        [formFieldKeys.chinaHsCode]: detail[formFieldKeys.chinaHsCode],

        [formFieldKeys.productDetail]: detail[formFieldKeys.productDetail],
      });
      const fileList = detail[formFieldKeys.productImages] || [];
      const { mainPictureIndex } = detail;
      const mainPictureUid = fileList[mainPictureIndex] && fileList[mainPictureIndex].uid;
      this.setState(
        {
          initValueSet: true,
          primayPicUid: mainPictureUid,
          fileList,
        },
        () => {
          this.handleCategoryChange([firstCategoryId, secondCategoryId, thirdCategoryId]);
        },
      );
    }
    if (mode === MODE_EDIT && !initAttributes && detail && categoryAttributes) {
      const { saleAttributes = [], generalAttributes = [] } = detail;
      this.setAttributes(saleAttributes, 'sale');
      this.setAttributes(generalAttributes, 'general');
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.setFloorNum);
  };

  setFloorNum = () => {
    const uploadList = document.getElementsByClassName('uploadList')[0];
    // 112是单个图片的宽度
    const floorNum = uploadList ? Math.floor(uploadList.clientWidth / 112) : 1;
    this.setState({ floorNum });
  };

  setAttributes = (attributes, specType) => {
    const prefix = specType === 'sale' ? SALE_SPEC_PREFIX : GEN_SPEC_PREFIX;
    const { form } = this.props;
    attributes.forEach(item => {
      const propId = `${prefix}_${item.productAttributeId}`;
      let val = null;
      if (item.productAttributeWidgetType === WidgetTypeName.dropdown) {
        val = item.productAttributeOptionId;
      }
      if (item.productAttributeWidgetType === WidgetTypeName.radio) {
        if (specType === 'sale') {
          val = (
            attributes.filter(t => t.productAttributeId === item.productAttributeId) || []
          ).map(t => t.productAttributeOptionId);
        } else {
          val = item.productAttributeOptionId;
        }
      }
      if (item.productAttributeWidgetType === WidgetTypeName.checkbox) {
        val = (attributes.filter(t => t.productAttributeId === item.productAttributeId) || []).map(
          t => t.productAttributeOptionId,
        );
      }
      if (item.productAttributeWidgetType === WidgetTypeName.regionPicker) {
        val = JSON.parse(item.productAttributeOptionValue);
      }
      if (item.productAttributeWidgetType === WidgetTypeName.datePicker) {
        val = moment(item.productAttributeOptionValue);
      }
      if (item.productAttributeWidgetType === WidgetTypeName.input) {
        val = item.productAttributeOptionValue;
      }
      form.setFieldsValue({
        [propId]: val,
      });
    });
    this.setState({ initAttributes: true });
  };

  handleFileUpload = ({ fileList }) => {
    const { primayPicUid } = this.state;
    this.setState({ fileList });
    const mainPictureIndex = fileList.findIndex(item => item.uid === primayPicUid);
    if (mainPictureIndex === -1) {
      // 找到第一张图片默认是主图
      const firstImage = fileList.find(({ type }) => type.indexOf('mp4') === -1);
      const newPrimayPicUid = firstImage === undefined ? '' : firstImage.uid;
      this.setState({ primayPicUid: newPrimayPicUid });
    }
  };

  productGroupValidator = (value, old, e) => {
    const { preValue = [] } = e;
    const oldValue = preValue.map(item => item.value);
    let newValue;
    if (value.length > 10) {
      message.warn(`${formatMessage({ id: 'product.detail.group.max-length' })}`);
      newValue = oldValue;
    } else {
      newValue = value;
    }
    return newValue;
  };

  uniqueSpec = attributes => {
    const spec = [];
    attributes.forEach(item => {
      const { productAttributeId } = item;
      const checkboxItem = spec.find(item1 => item1.productAttributeId === productAttributeId);
      const checkboxItemIndex = spec.findIndex(
        item2 => item2.productAttributeId === productAttributeId,
      );
      if (checkboxItem) {
        const newItem = Object.assign({}, checkboxItem, {
          productAttributeOptionValue: `
            ${checkboxItem.productAttributeOptionValue}, ${item.productAttributeOptionValue}
          `,
        });
        spec.splice(checkboxItemIndex, 1, newItem);
      } else {
        spec.push(item);
      }
    });
    return spec;
  };

  handleAddFieldOption = (item, index, val, propId) => {
    const repeat = item.options.some(t => t.value === val);
    if (repeat) {
      message.error('value repetition');
    }
    if (!val || repeat) {
      return;
    }
    const { thirdCategoryId } = this.state;
    addCategoryAttributeOption({
      productAttributeId: item.productAttributeId,
      productCategoryId: thirdCategoryId,
      value: val,
    }).then(res => {
      if (res.success) {
        this.setState(prev => {
          item.options.push(res.data);
          const { customizeValPool } = prev;
          const { categoryAttributes, dispatch } = this.props;
          customizeValPool[propId] = '';
          dispatch({ type: 'common/initCategoryAttributes', payload: categoryAttributes });
          this.setState({ customizeValPool });
          message.success('ok');
        });
      }
    });
  };

  handleRadioChange = e => {
    this.setState({ primayPicUid: e.target.value });
  };

  getParams = values => {
    const { mode, detail } = this.props;
    const { primayPicUid, fileList } = this.state;
    const [firstCategoryId, secondCategoryId, thirdCategoryId] = values.category || [];
    const saleAttributes = this.formatAttributeForSubmit(values, 'sale');
    const generalAttributes = this.formatAttributeForSubmit(values, 'general');
    const mainPictureIndex = fileList.findIndex(item => item.uid === primayPicUid);
    return {
      ...values,
      itemNo: values.itemNo || null,
      firstCategoryId,
      secondCategoryId,
      thirdCategoryId,
      mainPictureIndex: mainPictureIndex === -1 ? null : mainPictureIndex,
      currency: Number(values[formFieldKeys.currency]),
      price: values[formFieldKeys.price],
      uom: Number(values[formFieldKeys.uom]),
      validity: values[formFieldKeys.validaty] && values[formFieldKeys.validaty].toISOString(),
      saleAttributes,
      generalAttributes,
      id: mode === MODE_EDIT ? detail.id : undefined,
      sampleCurrency: 1, // 默认币种是USD
      video: values.video && values.video.length ? values.video[0] : null,
    };
  };

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        const params = this.getParams(values);
        poductSubmit(params).then(({ success }) => {
          if (success) {
            message.success(formatMessage({ id: 'yeeorder.Success' }));
            router.push('/product/MyProduct');
          }
        });
      }
    });
  };

  judgeFormValue = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const fieldValueArr = _values(getFieldsValue());
    const canSave = _some(
      fieldValueArr,
      val => {
        let result;
        if (typeof val === 'object') {
          result = !_isEmpty(val);
        } else {
          result = !!val || val === 0;
        }
        return result;
      },
      false,
    );
    if (!canSave) {
      message.error(`${formatMessage({ id: 'product.detail.saveNoData' })}`);
      return;
    }
    this.handleSave();
  };

  handleSave = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const params = this.getParams(getFieldsValue());
    poductSave(params).then(({ success }) => {
      if (success) {
        message.success(formatMessage({ id: 'yeeorder.Success' }));
        router.push('/product/MyProduct');
      }
    });
  };

  handleCategoryChange = val => {
    const [, , thirdCategoryId] = val;
    const { dispatch } = this.props;
    if (thirdCategoryId === undefined || thirdCategoryId === null) {
      dispatch({
        type: 'common/initCategoryAttributes',
        payload: null,
      });
    } else {
      dispatch({
        type: 'common/fetchCategoryAttributes',
        payload: {
          productCategoryId: thirdCategoryId,
        },
      });
    }
    this.setState({ thirdCategoryId });
  };

  formatAttributeForSubmit(values, specType) {
    const specPrefix = specType === 'general' ? GEN_SPEC_PREFIX : SALE_SPEC_PREFIX;
    const { categoryAttributes } = this.props;
    const { sales, generals } = categoryAttributes || { sales: [], generals: [] };
    const result = [];
    (specType === 'sale' ? sales : generals).forEach(item => {
      const propId = `${specPrefix}_${item.productAttributeId}`;
      const val = values[propId];
      if (val !== undefined) {
        if (item.widgetType === WidgetTypeName.checkbox) {
          val.forEach(t => {
            result.push({
              productAttributeWidgetType: item.widgetType,
              productAttributeId: item.productAttributeId,
              productAttributeName: item.name,
              productAttributeOptionId: t,
              productAttributeOptionValue: (
                item.options.find(t2 => t2.id.toString() === t.toString()) || {}
              ).value,
            });
          });
        } else if (item.widgetType === WidgetTypeName.radio && specType === 'sale') {
          val.forEach(t => {
            result.push({
              productAttributeWidgetType: item.widgetType,
              productAttributeId: item.productAttributeId,
              productAttributeName: item.name,
              productAttributeOptionId: t,
              productAttributeOptionValue: (
                item.options.find(t2 => t2.id.toString() === t.toString()) || {}
              ).value,
            });
          });
        } else {
          let productAttributeOptionValue = '';
          let productAttributeOptionId = (
            item.options.find(t2 => t2.id.toString() === val.toString()) || {}
          ).id;
          if (item.widgetType === WidgetTypeName.regionPicker) {
            productAttributeOptionValue = JSON.stringify(val);
            productAttributeOptionId = item.options[0].id;
          } else if (item.widgetType === WidgetTypeName.datePicker) {
            productAttributeOptionValue = val.toISOString();
            productAttributeOptionId = item.options[0].id;
          } else if (item.widgetType === WidgetTypeName.input) {
            productAttributeOptionValue = val;
            productAttributeOptionId = item.options[0].id;
          } else {
            productAttributeOptionValue = (
              item.options.find(t2 => t2.id.toString() === val.toString()) || {}
            ).value;
          }
          result.push({
            productAttributeWidgetType: item.widgetType,
            productAttributeId: item.productAttributeId,
            productAttributeName: item.name,
            productAttributeOptionId,
            productAttributeOptionValue,
          });
        }
      }
    });
    return result;
  }

  handleCustomPropChange(prop, val) {
    this.setState(prev => {
      const { customizeValPool } = prev;
      customizeValPool[prop] = val;
      this.setState({ customizeValPool });
    });
  }

  renderBasicInformation() {
    const { categoryTree, productGroup, uom, currency } = this.props;
    const { fileList, floorNum } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Row>
          <Col span={20}>
            <Form.Item label={formatMessage({ id: 'product.detail.category' })} required>
              {getFieldDecorator(formFieldKeys.category, {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'product.detail.category.requiredMsg' }),
                  },
                ],
              })(
                <Cascader
                  placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                  options={categoryTree}
                  onChange={this.handleCategoryChange}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item label={formatMessage({ id: 'product.detail.productName' })} required>
              {getFieldDecorator(formFieldKeys.productName, {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'product.detail.productName.requiredMsg' }),
                  },
                  {
                    max: 180,
                    min: 4,
                  },
                ],
              })(
                <Input
                  autoComplete='off'
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item label={formatMessage({ id: 'product.detail.group' })} required>
              {getFieldDecorator(formFieldKeys.group, {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'product.detail.group.requiredMsg' }),
                  },
                ],
                getValueFromEvent: this.productGroupValidator,
              })(
                <TreeSelect
                  dropdownStyle={{ height: 300 }}
                  treeCheckable
                  maxTagCount={10}
                  treeData={productGroup}
                  placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item label={formatMessage({ id: 'product.detail.productImages' })} required>
              {getFieldDecorator(formFieldKeys.productImages, {
                initialValue: [],
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'product.detail.productImages.required' }),
                  },
                ],
              })(
                <UploadList
                  className={styles.productImages}
                  accpet='.jpg, .jpeg, .png'
                  maxLength={10}
                  maxSize={{
                    'image/png': 1024,
                    'image/jpg': 1024,
                    'image/jpeg': 1024,
                  }}
                  listType='picture-card'
                  onOriginChange={this.handleFileUpload}
                />,
              )}
              {!!fileList.length && (
                <Radio.Group
                  onChange={this.handleRadioChange}
                  value={this.state.primayPicUid}
                  className={styles.primaryPic}
                >
                  {fileList.map((t, index) => {
                    const floor = Math.ceil((index + 1) / floorNum);
                    const top = floor * 110;
                    return (
                      <Radio
                        style={{ top }}
                        disabled={t.type.indexOf('mp4') !== -1}
                        key={t.uid}
                        value={t.uid}
                      >
                        {`${formatMessage({ id: 'yeeorder.primary-pic' })}`}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              )}
              <p style={{ marginBottom: 0, fontSize: 12 }}>
                {formatMessage({ id: 'product.detail.productImages.tips' })}
              </p>
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item label={formatMessage({ id: 'product.detail.productVideo' })}>
              {getFieldDecorator(formFieldKeys.productVideo)(
                <UploadList
                  accpet='.mp4'
                  maxLength={1}
                  maxSize={{
                    'video/mp4': 1024 * 10,
                  }}
                  listType='picture-card'
                />,
              )}
              <p style={{ marginBottom: 0, fontSize: 12 }}>
                {formatMessage({ id: 'product.detail.productVideo.tips' })}
              </p>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.uom' })} required>
              {getFieldDecorator(formFieldKeys.uom, {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'product.detail.uom.required' }),
                  },
                ],
              })(
                <Select placeholder={formatMessage({ id: 'yeeorder.please-select' })}>
                  {uom.map((t, index) => (
                    <Option value={t.value} key={index}>
                      {t.text}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.currency' })} required>
              {getFieldDecorator(formFieldKeys.currency, {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'product.detail.currency.required' }),
                  },
                ],
              })(
                <Select placeholder={formatMessage({ id: 'yeeorder.please-select' })}>
                  {currency.map((t, index) => (
                    <Option value={t.value} key={index}>
                      {t.text}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.price' })} required>
              {getFieldDecorator(formFieldKeys.price, {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'product.detail.price.required' }),
                  },
                ],
              })(
                <InputNumber
                  min={0.001}
                  max={999999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  autoComplete='off'
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.moq' })} required>
              {getFieldDecorator(formFieldKeys.moq, {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'product.detail.moq.required' }),
                  },
                ],
              })(
                <InputNumber
                  min={0.01}
                  max={999999999.99}
                  precision={2}
                  style={{ width: '100%' }}
                  autoComplete='off'
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }

  renderReadonlyBasicInformation() {
    const detail = this.props.detail || {};
    const { floorNum } = this.state;
    const { mainPictureIndex = 0 } = detail;
    const floor = Math.ceil((mainPictureIndex + 1) / floorNum); // 主图标志在第几层
    const index = mainPictureIndex % floorNum; // 主图标志在第几个
    const top = 25 + 110 + (floor - 1) * 122; // 主图标志的定位高度
    const left = 112 * index; // 主图标志的定位left
    return (
      <div>
        <Descriptions column={1}>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.category' })}>
            {detail.categoryNamePath && detail.categoryNamePath.join('>')}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.productName' })}>
            {detail[formFieldKeys.productName]}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.group' })}>
            {detail.groupNamePaths && detail.groupNamePaths.map(t => t.join('>')).join(', ')}
          </Descriptions.Item>
          <Descriptions.Item
            className={classNames(styles.imgRow, styles.detailProductImages)}
            label={formatMessage({ id: 'product.detail.productImages' })}
          >
            {<UploadList value={detail.multimediaInfo || []} disabled listType='picture-card' />}
            {
              <span
                className={styles.primaryPic}
                style={{
                  top,
                  left,
                  width: 104,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {`${formatMessage({ id: 'yeeorder.primary-pic' })}`}
              </span>
            }
          </Descriptions.Item>
          <Descriptions.Item
            className={detail.video ? styles.imgRow : ''}
            label={formatMessage({ id: 'product.detail.productVideo' })}
          >
            {detail.video ? (
              <UploadList value={[detail.video]} disabled listType='picture-card' />
            ) : (
              '--'
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={2}>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.uom' })}>
            {detail.uomText}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.currency' })}>
            {detail.currencyText}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.price' })}>
            {detail.price ? `$${detail.price}` : '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.moq' })}>
            {`${detail.moq} ${detail.uomText}`}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }

  renderField(item, index, specType) {
    const specPrefix = specType === 'general' ? GEN_SPEC_PREFIX : SALE_SPEC_PREFIX;
    const { getFieldDecorator } = this.props.form;
    const { customizeValPool: customizeControls } = this.state;
    let field = null;
    const propId = `${specPrefix}_${item.productAttributeId}`;
    const customable = item.customizable && CUSTOMABLE_CONTROLS.some(t => t === item.widgetType);
    const fixwidthType = [
      WidgetTypeName.input,
      WidgetTypeName.datePicker,
      WidgetTypeName.dropdown,
    ].some(t => t === item.widgetType);
    switch (item.widgetType) {
      case WidgetTypeName.checkbox:
        field = getFieldDecorator(propId, {
          rules: [
            {
              required: item.required,
              message: `${item.name} ${formatMessage({ id: 'yeeorder.is-required' })}`,
            },
          ],
        })(
          <Checkbox.Group
            className={fixwidthType && styles.fixWidthField}
            options={item.options.map(t => ({ label: t.value, value: t.id }))}
          />,
        );
        break;
      case WidgetTypeName.radio:
        if (specType === 'general') {
          field = getFieldDecorator(propId, {
            rules: [
              {
                required: item.required,
                message: `${item.name} ${formatMessage({ id: 'yeeorder.is-required' })}`,
              },
            ],
          })(
            <Radio.Group
              className={fixwidthType && styles.fixWidthField}
              options={item.options.map(t => ({ label: t.value, value: t.id }))}
            />,
          );
        } else {
          field = getFieldDecorator(propId, {
            rules: [
              {
                required: item.required,
                message: `${item.name} ${formatMessage({ id: 'yeeorder.is-required' })}`,
              },
            ],
          })(
            <Checkbox.Group
              className={fixwidthType && styles.fixWidthField}
              options={item.options.map(t => ({ label: t.value, value: t.id }))}
            />,
          );
        }
        break;
      case WidgetTypeName.input:
        field = getFieldDecorator(propId, {
          rules: [
            {
              required: item.required,
              message: `${item.name} ${formatMessage({ id: 'yeeorder.is-required' })}`,
            },
          ],
        })(
          <Input
            className={fixwidthType && styles.fixWidthField}
            autoComplete='off'
            placeholder={formatMessage({ id: 'yeeorder.please-input' })}
          />,
        );
        break;
      case WidgetTypeName.dropdown:
        field = getFieldDecorator(propId, {
          rules: [
            {
              required: item.required,
              message: `${item.name} ${formatMessage({ id: 'yeeorder.is-required' })}`,
            },
          ],
        })(
          <Select
            className={fixwidthType && styles.fixWidthField}
            placeholder={formatMessage({ id: 'yeeorder.please-select' })}
          >
            {item.options.map(t => (
              <Select.Option key={t.value}>{t.value}</Select.Option>
            ))}
          </Select>,
        );
        break;
      case WidgetTypeName.datePicker:
        field = getFieldDecorator(propId, {
          rules: [
            {
              required: item.required,
              message: `${item.name} ${formatMessage({ id: 'yeeorder.is-required' })}`,
            },
          ],
        })(
          <DatePicker
            placeholder={formatMessage({ id: 'yeeorder.please-select' })}
            className={fixwidthType && styles.fixWidthField}
          />,
        );
        break;
      case WidgetTypeName.regionPicker:
        field = getFieldDecorator(propId, {
          trigger: 'handleChange',
          rules: [
            {
              required: true,
              message: `${item.name} ${formatMessage({ id: 'yeeorder.is-required' })}`,
            },
          ],
        })(<Address hideDetailAddress />);
        break;
      default:
        break;
    }
    return (
      field && (
        <Form.Item key={item.productAttributeId} label={item.name} required={item.required}>
          {field}
          {customable && (
            <div className={styles.addControl}>
              <Input
                value={customizeControls[propId]}
                onChange={e => this.handleCustomPropChange(propId, e.target.value)}
                onPressEnter={() =>
                  this.handleAddFieldOption(item, index, customizeControls[propId], propId)
                }
                autoComplete='off'
                placeholder={formatMessage({ id: 'yeeorder.please-input' })}
              />
              <Icon
                className={styles.plus}
                type='plus'
                onClick={() =>
                  this.handleAddFieldOption(item, index, customizeControls[propId], propId)
                }
              />
            </div>
          )}
        </Form.Item>
      )
    );
  }

  renderFieldReadonly = item => {
    let val = item.productAttributeOptionValue;
    if (item.productAttributeWidgetType === WidgetTypeName.regionPicker) {
      const tmp = JSON.parse(item.productAttributeOptionValue);
      val = `${tmp.provinceName} ${tmp.cityName} ${tmp.districtName}`;
    }
    if (item.productAttributeWidgetType === WidgetTypeName.datePicker) {
      val = <DateIn18 date={val} />;
    }
    return (
      <Descriptions.Item label={item.productAttributeName} key={item.productAttributeId}>
        {val}
      </Descriptions.Item>
    );
  };

  renderGeneralSpec() {
    const { mode, categoryAttributes } = this.props;
    const { generals } = categoryAttributes || { generals: [] };
    return (
      <Card bordered={false} title={formatMessage({ id: 'product.detail.title.generalSpec' })}>
        {mode === MODE_READONLY
          ? this.renderGeneralSpecReadonly()
          : generals.map((item, index) => this.renderField(item, index, 'general'))}
      </Card>
    );
  }

  renderSaleSpec() {
    const { mode } = this.props;
    const { categoryAttributes } = this.props;
    const { sales } = categoryAttributes || { sales: [] };
    return (
      <Card bordered={false} title={formatMessage({ id: 'product.detail.title.saleSpec' })}>
        {mode === MODE_READONLY
          ? this.renderSaleSpecReadonly()
          : sales.map((item, index) => this.renderField(item, index, 'sale'))}
      </Card>
    );
  }

  renderGeneralSpecReadonly() {
    const { generalAttributes } = this.props.detail || { generalAttributes: [] };
    const general = this.uniqueSpec(generalAttributes);
    return (
      <Descriptions column={2}>{general.map(item => this.renderFieldReadonly(item))}</Descriptions>
    );
  }

  renderSaleSpecReadonly() {
    const { saleAttributes } = this.props.detail || { saleAttributes: [] };
    const sale = this.uniqueSpec(saleAttributes);
    return (
      <Descriptions column={2}>{sale.map(item => this.renderFieldReadonly(item))}</Descriptions>
    );
  }

  renderOtherINformationReadonly() {
    const detail = this.props.detail || {};
    return (
      <Card bordered={false} title={formatMessage({ id: 'product.detail.otherInformation' })}>
        <Descriptions column={2}>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.incoTerms' })}>
            {detail.incoTermsText || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.itemNo' })}>
            {detail[formFieldKeys.itemNo] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.leadTime' })}>
            {detail[formFieldKeys.normalProductionLeadTime] || '--'}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.validity' })}>
            {detail[formFieldKeys.validaty] ? (
              <DateIn18 date={detail[formFieldKeys.validaty]} />
            ) : (
              '--'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.chinaHsCode' })}>
            {detail[formFieldKeys.chinaHsCode] || '--'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }

  renderOtherInformation() {
    const { getFieldDecorator } = this.props.form;
    const { incoterm } = this.props;
    return (
      <Card bordered={false} title={formatMessage({ id: 'product.detail.otherInformation' })}>
        <Row gutter={15}>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.incoTerms' })}>
              {getFieldDecorator(formFieldKeys.preferedIncoTerms, {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({ id: 'product.detail.incoTerms.required' })}`,
                  },
                ],
              })(
                <Select placeholder={formatMessage({ id: 'yeeorder.please-select' })}>
                  {incoterm.map((t, index) => (
                    <Option value={t.value} key={index}>
                      {t.text}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.itemNo' })}>
              {getFieldDecorator(formFieldKeys.itemNo, {
                validateFirst: true,
                rules: [
                  {
                    max: 18,
                  },
                  {
                    pattern: regexpEngNum,
                    message: `${formatMessage({ id: 'yeeorder.regexp.eng_num.msg' })}`,
                  },
                ],
              })(
                <Input
                  autoComplete='off'
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.leadTime' })}>
              {getFieldDecorator(formFieldKeys.normalProductionLeadTime, {
                // rules: [
                //   {
                //     required: true,
                //     message: `${formatMessage({ id: 'product.detail.leadTime.required' })}`,
                //   },
                // ],
              })(
                <Input
                  autoComplete='off'
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.validity' })}>
              {getFieldDecorator(formFieldKeys.validaty, {
                // rules: [
                //   {
                //     required: true,
                //     message: `${formatMessage({ id: 'product.detail.validity.required' })}`,
                //   },
                // ],
              })(<DatePicker />)}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.chinaHsCode' })}>
              {getFieldDecorator(formFieldKeys.chinaHsCode, {
                // rules: [
                //   {
                //     required: true,
                //     message: `${formatMessage({ id: 'product.detail.chinaHsCode.required' })}`,
                //   },
                // ],
              })(
                <Input
                  autoComplete='off'
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  }

  renderButtomBtns() {
    const { mode } = this.props;
    if (mode === MODE_READONLY) {
      return null;
    }
    return (
      <BottomPanel>
        <Button onClick={this.handleSave} type='primary' style={{ marginRight: 20 }}>
          {formatMessage({ id: 'yeeorder.Save' })}
        </Button>
        <Button onClick={this.handleSubmit} type='primary'>
          {formatMessage({ id: 'yeeorder.Submit' })}
        </Button>
      </BottomPanel>
    );
  }

  renderEditorReadonly() {
    const { detail } = this.props;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: detail && (detail[formFieldKeys.productDetail] || null),
        }}
      ></div>
    );
  }

  renderEditor() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form.Item>
        {getFieldDecorator(formFieldKeys.productDetail, {
          validateFirst: true,
          initialValue: null,
        })(<UcharmEditor />)}
      </Form.Item>
    );
  }

  renderSampleInformationReadonly = () => {
    const detail = this.props.detail || {};
    const offerSample = detail.sampleOfferFlag;
    const offerFreeSample = detail.sampleFreeFlag;
    return (
      <Card bordered={false} title={formatMessage({ id: 'product.detail.sampleInformation' })}>
        <Descriptions column={2}>
          <Descriptions.Item label={formatMessage({ id: 'product.detail.offerSample' })}>
            {offerSample
              ? `${formatMessage({ id: 'yeeorder.Yes' })}`
              : `${formatMessage({ id: 'yeeorder.No' })}`}
          </Descriptions.Item>
          {offerSample && (
            <Descriptions.Item label={formatMessage({ id: 'product.detail.offerFreeSample' })}>
              {offerFreeSample
                ? `${formatMessage({ id: 'yeeorder.Free' })}`
                : `${formatMessage({ id: 'yeeorder.No' })}`}
            </Descriptions.Item>
          )}
          {offerSample && !offerFreeSample && (
            <Descriptions.Item label={formatMessage({ id: 'product.detail.offerUnitPrice' })}>
              {detail[`${formFieldKeys.offerUnitPrice}Text`] || '--'} /{' '}
              {detail[`${formFieldKeys.sampleUOM}Text`] || '--'}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    );
  };

  renderSampleInformation = () => {
    const { uom } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const offerSample = getFieldValue(formFieldKeys.offerSample);
    const offerFreeSample = getFieldValue(formFieldKeys.offerFreeSample);
    return (
      <Card bordered={false} title={formatMessage({ id: 'product.detail.sampleInformation' })}>
        <Row gutter={15}>
          <Col span={10}>
            <Form.Item label={formatMessage({ id: 'product.detail.offerSample' })}>
              {getFieldDecorator(formFieldKeys.offerSample, {
                rules: [
                  {
                    required: true,
                    message: `${formatMessage({ id: 'product.detail.offerSample.required' })}`,
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          {offerSample !== NO_NEED_SAMPLE && (
            <>
              <Col span={10}>
                <Form.Item label={formatMessage({ id: 'product.detail.offerFreeSample' })}>
                  {getFieldDecorator(formFieldKeys.offerFreeSample, {
                    rules: [
                      {
                        required: true,
                        message: `${formatMessage({
                          id: 'product.detail.offerFreeSample.required',
                        })}`,
                      },
                    ],
                  })(
                    <Radio.Group>
                      <Radio value>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              {offerFreeSample !== OFFER_FREE_SAMPLE && (
                <Col span={10}>
                  <Form.Item label={formatMessage({ id: 'product.detail.offerUnitPrice' })}>
                    <InputGroup compact style={{ display: 'flex' }}>
                      {getFieldDecorator(formFieldKeys.offerUnitPrice, {
                        rules: [
                          {
                            required: true,
                            message: `${formatMessage({
                              id: 'product.detail.offerUnitPrice.required',
                            })}`,
                          },
                        ],
                      })(
                        <InputNumber
                          min={0.001}
                          max={999999999.999}
                          precision={3}
                          style={{ width: '100%' }}
                          autoComplete='off'
                          placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                        />,
                      )}
                      <p className={styles.inputNumberAfter}>USD</p>
                    </InputGroup>
                  </Form.Item>
                </Col>
              )}
            </>
          )}
          {offerSample !== NO_NEED_SAMPLE && (
            <Col span={10}>
              <Form.Item label={formatMessage({ id: 'product.detail.uom' })}>
                {getFieldDecorator(formFieldKeys.sampleUOM, {
                  rules: [
                    {
                      required: true,
                      message: `${formatMessage({
                        id: 'product.detail.uom.required',
                      })}`,
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={`${formatMessage({ id: 'yeeorder.please-select' })}`}
                  >
                    {uom.map(({ value, text }) => (
                      <Option key={value} value={value}>
                        {text}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
        </Row>
      </Card>
    );
  };

  render() {
    const { mode } = this.props;
    return (
      <Form layout='horizontal' className={styles.root}>
        <Card bordered={false} title={formatMessage({ id: 'product.detail.title.basicInfo' })}>
          {mode === MODE_READONLY
            ? this.renderReadonlyBasicInformation()
            : this.renderBasicInformation()}
        </Card>
        {this.renderGeneralSpec()}
        {this.renderSaleSpec()}
        {mode === MODE_READONLY
          ? this.renderSampleInformationReadonly()
          : this.renderSampleInformation()}
        {mode === MODE_READONLY
          ? this.renderOtherINformationReadonly()
          : this.renderOtherInformation()}
        <Card
          title={formatMessage({ id: 'product.detail.title.productDetails' })}
          className={styles.cardDetail}
          bordered={false}
        >
          {mode === MODE_READONLY ? this.renderEditorReadonly() : this.renderEditor()}
          {mode !== MODE_READONLY && this.renderButtomBtns()}
        </Card>
      </Form>
    );
  }
}
export default Form.create()(AddProduct);
