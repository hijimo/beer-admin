import { Button, Card, Form, Input, Select, Row, Col, Modal, message, InputNumber } from 'antd';
import { formatMessage, getLocale } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import UploadList from '@common/components/UploadList';
import moment from 'moment';
import ChooseProduct from './ChooseProduct';
import { QuoteKeys } from './enum';
import { fetchDictList } from '@/services/profile';
import { regexpEngNum } from '@/utils/validate';
import styles from '../style.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const {
  ProductName,
  ItemNo,
  UnitPrice,
  Quantity,
  UOM,
  MOQ,
  ProductImages,
  ProductDetail,
} = QuoteKeys;
const WidgetTypeName = {
  radio: 0,
  checkbox: 1,
  dropdown: 2,
  input: 3,
  regionPicker: 4,
  datePicker: 5,
};

class BasicInfo extends Component {
  state = {
    dictList: {},
    visible: false,
    selectedRow: null,
  };

  componentDidMount() {
    this.fetchDictListMethod();
  }

  fetchDictListMethod = async () => {
    const dictKey = ['uom'];
    const { success, data } = await fetchDictList(dictKey);
    if (success) this.setState({ dictList: data });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  renderFieldReadonly = item => {
    let val = item.productAttributeOptionValue;
    if (item.productAttributeWidgetType === WidgetTypeName.regionPicker) {
      const tmp = JSON.parse(item.productAttributeOptionValue);
      val = `${tmp.provinceName} ${tmp.cityName} ${tmp.districtName}`;
    }
    if (item.productAttributeWidgetType === WidgetTypeName.datePicker) {
      val = moment(val)
        .locale(getLocale())
        .format('LL');
    }
    return `${item.productAttributeName}: ${val}`;
  };

  handleConfirm = () => {
    const { selectedRow } = this.state;
    const {
      form: { setFieldsValue },
    } = this.props;
    if (!selectedRow) {
      message.warning(`${formatMessage({ id: 'rfq.quote.product-warn' })}`);
      return;
    }
    const { saleAttributes = [], generalAttributes = [] } = selectedRow;
    const attributes = [...saleAttributes, ...generalAttributes].map(item =>
      this.renderFieldReadonly(item),
    );
    const fieldsValue = {
      [ProductName.key]: selectedRow[ProductName.key],
      [ItemNo.key]: selectedRow[ItemNo.key],
      [UnitPrice.key]: selectedRow[UnitPrice.key],
      [MOQ.key]: selectedRow[MOQ.key],
      [ProductImages.key]: [selectedRow[ProductImages.key]],
      [UOM.key]: selectedRow[UOM.key],
      [ProductDetail.key]: attributes.join(';'),
    };
    setFieldsValue(fieldsValue, () => {
      this.setState({ visible: false });
    });
  };

  handleClear = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const fieldsValue = {
      [ProductName.key]: null,
      [ItemNo.key]: null,
      [UnitPrice.key]: null,
      [MOQ.key]: null,
      [ProductImages.key]: [],
      [UOM.key]: 1,
      [ProductDetail.key]: null,
    };
    setFieldsValue(fieldsValue);
  };

  onSelect = selectedRows => {
    this.setState({ selectedRow: selectedRows[0] });
  };

  resetData = () => {
    this.setState({ selectedRow: {} });
  };

  render() {
    const { dictList, visible } = this.state;
    const { uom = [] } = dictList;
    const {
      form: { getFieldDecorator },
      thirdCategoryId,
    } = this.props;
    const colLayout = {
      xl: { span: 12 },
      lg: { span: 16 },
      md: { span: 24 },
      sm: { span: 24 },
    };
    const ProductLabel = () => (
      <>
        {formatMessage({ id: ProductName.label })}:
        <Button type='link' onClick={() => this.showModal()}>
          {formatMessage({ id: 'yeeorder.select' })}
        </Button>
        <Button type='link' onClick={() => this.handleClear()}>
          {formatMessage({ id: 'yeeorder.clear' })}
        </Button>
      </>
    );
    return (
      <>
        <Card
          title={formatMessage({ id: 'rfq.quote.basic-info' })}
          bordered={false}
          style={{ marginTop: 24 }}
        >
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem colon={false} label={<ProductLabel />}>
                {getFieldDecorator(ProductName.key, {
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: ProductName.required }),
                    },
                    {
                      min: 4,
                      max: 180,
                    },
                    // {
                    //   pattern: regexpEngNumSpc,
                    //   message: `${formatMessage({ id: 'yeeorder.regexp.eng_num_spc.msg' })}`,
                    // },
                    // {
                    //   validator: blankCheck,
                    // },
                  ],
                })(
                  <Input
                    autoComplete='off'
                    placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: ItemNo.label })}>
                {getFieldDecorator(ItemNo.key, {
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
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: UnitPrice.label })}>
                <InputGroup compact style={{ display: 'flex' }}>
                  {getFieldDecorator(UnitPrice.key, {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: UnitPrice.required }),
                      },
                    ],
                  })(
                    <InputNumber
                      placeholder={`${formatMessage({ id: 'yeeorder.please-input' })}`}
                      min={0.001}
                      max={999999999.999}
                      precision={3}
                      style={{ flex: 1 }}
                    />,
                  )}
                  <p className={styles.inputNumberAfter}>USD</p>
                </InputGroup>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <InputGroup compact>
                <FormItem
                  style={{ width: 'calc(100% - 80px)' }}
                  label={formatMessage({ id: Quantity.label })}
                >
                  {getFieldDecorator(Quantity.key, {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: Quantity.required }),
                      },
                    ],
                  })(
                    <InputNumber
                      placeholder={`${formatMessage({ id: 'yeeorder.please-input' })}`}
                      min={0.01}
                      max={999999999.99}
                      precision={2}
                      style={{ width: '100%', borderRadius: '4px 0 0 4px' }}
                    />,
                  )}
                </FormItem>
                {getFieldDecorator(UOM.key, {
                  initialValue: 1,
                })(
                  <Select style={{ width: 80, marginTop: 32 }}>
                    {uom.map(({ value, text }) => (
                      <Option key={value} value={value}>
                        {text}
                      </Option>
                    ))}
                  </Select>,
                )}
              </InputGroup>
            </Col>
          </Row>
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: MOQ.label })}>
                {getFieldDecorator(MOQ.key, {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: MOQ.required }),
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
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} type='flex'>
            <Col span={24}>
              <FormItem label={formatMessage({ id: ProductImages.label })}>
                {getFieldDecorator(ProductImages.key, {
                  initialValue: [],
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: ProductImages.required }),
                    },
                  ],
                })(
                  <UploadList
                    accpet='.png, .jpg, .jpeg'
                    listType='picture-card'
                    maxLength={10}
                    maxSize={3 * 1024}
                  />,
                )}
                <p className={styles.uploadTips}>{formatMessage({ id: ProductImages.tips })}</p>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Modal
          title={formatMessage({ id: 'rfq.quote.product' })}
          visible={visible}
          onOk={this.handleConfirm}
          onCancel={this.hideModal}
          okText={formatMessage({ id: 'yeeorder.Confirm' })}
          cancelText={formatMessage({ id: 'yeeorder.Cancel' })}
          width='60%'
          maskClosable={false}
          destroyOnClose
        >
          <ChooseProduct
            thirdCategoryId={thirdCategoryId}
            onSelect={this.onSelect}
            resetData={this.resetData}
          />
        </Modal>
      </>
    );
  }
}

export default BasicInfo;
