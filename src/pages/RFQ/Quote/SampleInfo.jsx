import { Card, Form, Input, Select, Row, Col, Radio, DatePicker, InputNumber } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { PureComponent } from 'react';
import moment from 'moment';
import TextArea from '@common/components/TextArea/TextArea';
import { QuoteKeys } from './enum';
// import { regexpEngNumSpc } from '@/utils/validate';
// import { blankCheck } from './validator';
import { fetchDictList } from '@/services/profile';
import styles from '../style.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const {
  OfferSample,
  OfferFreeSample,
  SampleUnitPrice,
  SampleUOM,
  ExpectedDeliveryDate,
  Remark,
} = QuoteKeys;
const OfferSampleValue = {
  Yes: 1,
  No: 0,
};
const OfferFreeSampleValue = {
  Yes: 1,
  No: 0,
};

class SampleInfo extends PureComponent {
  state = {
    offerSample: OfferSampleValue.Yes,
    dictList: {},
  };

  componentDidMount() {
    this.fetchDictListMethod();
  }

  fetchDictListMethod = async () => {
    const dictKey = ['uom'];
    const { success, data } = await fetchDictList(dictKey);
    if (success) this.setState({ dictList: data });
  };

  handleChange = e => this.setState({ offerSample: e.target.value });

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { offerSample, dictList } = this.state;
    const { uom = [] } = dictList;
    const colLayout = {
      xl: { span: 12 },
      lg: { span: 16 },
      md: { span: 24 },
      sm: { span: 24 },
    };
    const offerFreeSample = getFieldValue(OfferFreeSample.key);
    return (
      <>
        <Card
          title={formatMessage({ id: 'rfq.quote.sample-info' })}
          bordered={false}
          style={{ marginTop: 24 }}
        >
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: OfferSample.label })}>
                {getFieldDecorator(OfferSample.key, {
                  initialValue: OfferSampleValue.Yes,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: OfferSample.required }),
                    },
                  ],
                })(
                  <Radio.Group onChange={this.handleChange}>
                    <Radio value={OfferSampleValue.Yes}>Yes</Radio>
                    <Radio value={OfferSampleValue.No}>No</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
          </Row>
          {offerSample === OfferSampleValue.Yes && (
            <>
              <Row gutter={16} type='flex'>
                <Col {...colLayout}>
                  <FormItem label={formatMessage({ id: OfferFreeSample.label })}>
                    {getFieldDecorator(OfferFreeSample.key, {
                      initialValue: OfferFreeSampleValue.No,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: OfferFreeSample.required }),
                        },
                      ],
                    })(
                      <Radio.Group>
                        <Radio value={OfferFreeSampleValue.Yes}>Yes</Radio>
                        <Radio value={OfferFreeSampleValue.No}>No</Radio>
                      </Radio.Group>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              {offerFreeSample !== OfferFreeSampleValue.Yes && (
                <Row gutter={16} type='flex'>
                  <Col {...colLayout}>
                    <FormItem label={formatMessage({ id: SampleUnitPrice.label })}>
                      <InputGroup compact style={{ display: 'flex' }}>
                        {getFieldDecorator(SampleUnitPrice.key, {
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: SampleUnitPrice.required }),
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
              )}
              <Row gutter={16} type='flex'>
                <Col {...colLayout}>
                  <FormItem label={formatMessage({ id: SampleUOM.label })}>
                    <InputGroup compact style={{ display: 'flex' }}>
                      {getFieldDecorator(SampleUOM.key, {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: SampleUOM.required }),
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
                    </InputGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16} type='flex'>
                <Col {...colLayout}>
                  <FormItem label={formatMessage({ id: ExpectedDeliveryDate.label })}>
                    {getFieldDecorator(ExpectedDeliveryDate.key, {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: ExpectedDeliveryDate.required }),
                        },
                      ],
                    })(
                      <DatePicker
                        disabledDate={current => current && current < moment().endOf('day')}
                        style={{ width: '100%' }}
                        format='YYYY-MM-DD'
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16} type='flex'>
                <Col {...colLayout}>
                  <FormItem label={formatMessage({ id: Remark.label })}>
                    {getFieldDecorator(Remark.key, {
                      // validateFirst: true,
                      // rules: [
                      //   {
                      //     pattern: regexpEngNumSpc,
                      //     message: `${formatMessage({ id: 'yeeorder.regexp.eng_num_spc.msg' })}`,
                      //   },
                      //   {
                      //     validator: blankCheck,
                      //   },
                      // ],
                    })(
                      <TextArea
                        maxLength={500}
                        rows={4}
                        autoComplete='off'
                        placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </>
    );
  }
}

export default SampleInfo;
