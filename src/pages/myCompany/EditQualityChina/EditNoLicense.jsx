import {
  Button,
  Modal,
  InputNumber,
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  Tag,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import _get from 'lodash/get';
import moment from 'moment';
import YearPicker from '@common/components/YearPicker';
import BottomPanel from '@/components/BottomPanel';
import TableForm from './TableForm';
import SelectCountry from './SelectCountry';
import { lenErrMessage } from '@/utils/utils';
import { fetchRegion, fetchDictList } from '@/services/profile';
import { QCConf as FORM_KEYS } from '../config';

const FormItem = Form.Item;
const { Option } = Select;
const typeProvince = 1;
const typeCity = 2;
const typeDistrict = 3;
const maxCharacters = 500;

class EditNoLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provinceList: [],
      cityList: [],
      districtList: [],
      modalVisible: false,
      dictList: {},
      ourCustomer: this.getOurCustomer(),
      annualProduction: this.getAnnualProduction(),
    };
  }

  componentDidMount() {
    this.fetchDictListMethods();
    this.handleRegion();
  }

  fetchDictListMethods = async () => {
    const dictKey = ['businessType', 'annualRevenueType', 'employees', 'listedStatus'];
    const { success, data } = await fetchDictList(dictKey);
    if (success) {
      this.setState({ dictList: data });
    }
  };

  handleRegion = () => {
    const legalAddressPro = _get(this.props, 'qualityChina.legalAddressPro');
    const legalAddressCity = _get(this.props, 'qualityChina.legalAddressCity');
    this.fetchRegionMethod(1, typeProvince);
    this.fetchRegionMethod(legalAddressPro, typeCity);
    this.fetchRegionMethod(legalAddressCity, typeDistrict);
  };

  fetchRegionMethod = (pid, type) => {
    fetchRegion({ pid }).then(async res => {
      const { success, data } = res;
      if (success) {
        switch (type) {
          case typeProvince:
            this.setState({ provinceList: data });
            break;
          case typeCity:
            this.setState({ cityList: data });
            break;
          case typeDistrict:
            this.setState({ districtList: data });
            break;
          default:
            break;
        }
      }
    });
  };

  clearValue = field => {
    const {
      form: { setFieldsValue },
    } = this.props;
    switch (field) {
      case 'province':
        this.setState({ cityList: [] });
        this.setState({ districtList: [] });
        setFieldsValue({
          legalAddressCity: undefined,
          legalAddressDis: undefined,
        });
        break;
      case 'city':
        this.setState({ districtList: [] });
        setFieldsValue({ legalAddressDis: undefined });
        break;
      default:
        break;
    }
  };

  handleProvinceChange = ({ key }) => {
    this.fetchRegionMethod(key, typeCity);
    this.clearValue('province');
  };

  handleCityChange = ({ key }) => {
    this.fetchRegionMethod(key, typeDistrict);
    this.clearValue('city');
  };

  getAnnualProduction = () => {
    const list = [
      { key: 1, name: undefined, quantity: undefined, uom: undefined },
      { key: 2, name: undefined, quantity: undefined, uom: undefined },
      { key: 3, name: undefined, quantity: undefined, uom: undefined },
    ];
    const annualProduction = _get(this.props, 'qualityChina.annualProduction.list', []);
    annualProduction.forEach((item, index) => {
      list[index] = Object.assign({}, item, {
        key: index,
      });
    });
    return list;
  };

  getOurCustomer = () => _get(this.props, 'qualityChina.ourCustomer.list', []);

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const { annualProduction = [] } = values;
        if (!this.validateTableForm(annualProduction)) {
          return;
        }
        this.submitConfirm(values);
      }
    });
  };

  submitConfirm = values => {
    const that = this;
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Submit' })}`,
      content: `${formatMessage({ id: 'profile.Submit-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        that.submitQualityChina(values);
      },
    });
  };

  submitQualityChina = async values => {
    const { dispatch } = this.props;
    const {
      ourCustomer,
      annualProduction = [],
      legalAddressCity,
      legalAddressDis,
      legalAddressPro,
      yearEstablished,
    } = values;
    const {
      qualityChina: { companyId, companyName, companyNameEng, companyNo, legalPersonName },
    } = this.props;
    const params = Object.assign({}, values, {
      ourCustomer: { list: ourCustomer },
      annualProduction: { list: annualProduction },
      legalAddressPro: legalAddressPro.key,
      legalAddressProName: legalAddressPro.label,
      legalAddressCity: legalAddressCity.key,
      legalAddressCityName: legalAddressCity.label,
      legalAddressDis: legalAddressDis.key,
      legalAddressDisName: legalAddressDis.label,
      yearEstablished: moment(yearEstablished).format('YYYY'),
      companyId,
      companyName,
      companyNameEng,
      companyNo,
      legalPersonName,
    });
    dispatch({
      type: 'myCompany/editQChinaWithoutLicense',
      payload: params,
    });
  };

  validateTableForm = (annualProduction = []) => {
    let result = false;
    let done = false;
    for (const item of annualProduction) {
      if (item.name && item.quantity && item.uom) {
        result = true;
        done = true;
      } else if (!item.name && !item.quantity && !item.uom) {
        result = true;
      } else {
        result = false;
        break;
      }
    }
    if (!result) {
      message.error(`${formatMessage({ id: 'profile.annual-production.warn-complete' })}`);
      return false;
    }
    if (!done) {
      message.error(`${formatMessage({ id: 'profile.annual-production.warn-empty' })}`);
      return false;
    }
    return true;
  };

  toggleDialog = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  customerChange = selectedCountry => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ ourCustomer: selectedCountry });
    setFieldsValue({ ourCustomer: selectedCountry });
  };

  handleCancel = () => {
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      content: `${formatMessage({ id: 'profile.Cancel-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        router.push('/myCompany?tab=qualityChina');
      },
    });
  };

  render() {
    const {
      qualityChina = {},
      form: { getFieldDecorator },
    } = this.props;
    const {
      modalVisible,
      provinceList = [],
      cityList = [],
      districtList = [],
      dictList,
      annualProduction = [],
      ourCustomer = [],
    } = this.state;
    const {
      businessType = [],
      annualRevenueType = [],
      employees = [],
      listedStatus = [],
    } = dictList;
    const colLayout = {
      lg: { span: 8 },
      md: { span: 12 },
      sm: { span: 24 },
    };
    const {
      Contact,
      Telephone,
      Email,
      YearEstablished,
      RegistrationCapital,
      OfficeAddressPro,
      OfficeAddressCity,
      OfficeAddressDis,
      DetailAddress,
      BusinessType,
      ListedCompany,
      AnnualRevenue,
      Employees,
      FactorySize,
      NoProductionLines,
      NoEquipment,
      AnnualExportVolume,
      AnnualProduction,
      OurCustomer,
    } = FORM_KEYS;
    const modelProps = {
      modalVisible,
      country: ourCustomer,
      toggleDialog: this.toggleDialog,
      countryChange: this.customerChange,
    };
    return (
      <>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Row gutter={16} type='flex'>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: Contact.label })}>
                  {getFieldDecorator(Contact.key, {
                    initialValue: qualityChina[Contact.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: Contact.required,
                        }),
                      },
                      {
                        max: maxCharacters,
                        message: lenErrMessage({ max: maxCharacters }),
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
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: Telephone.label })}>
                  {getFieldDecorator(Telephone.key, {
                    initialValue: qualityChina[Telephone.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: Telephone.required,
                        }),
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: formatMessage({ id: Telephone.formatError }),
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
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: Email.label })}>
                  {getFieldDecorator(Email.key, {
                    initialValue: qualityChina[Email.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: Email.required,
                        }),
                      },
                      {
                        type: 'email',
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
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: YearEstablished.label })}>
                  {getFieldDecorator(YearEstablished.key, {
                    initialValue: moment(qualityChina[YearEstablished.key]),
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: YearEstablished.required,
                        }),
                      },
                    ],
                  })(
                    <YearPicker
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: RegistrationCapital.label })}>
                  {getFieldDecorator(RegistrationCapital.key, {
                    initialValue: qualityChina[RegistrationCapital.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: RegistrationCapital.required,
                        }),
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16} type='flex'>
              <Col xl={16} lg={16} md={16} sm={24}>
                <FormItem
                  label={formatMessage({ id: 'profile.quality-China.office-address' })}
                  required
                  style={{ marginBottom: 0 }}
                >
                  <Row gutter={8} type='flex'>
                    <Col span={8}>
                      <FormItem>
                        {getFieldDecorator(OfficeAddressPro.key, {
                          initialValue: {
                            key: qualityChina[OfficeAddressPro.key],
                            label: qualityChina[`${OfficeAddressPro.key}Name`],
                          },
                          validateFirst: true,
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: OfficeAddressPro.required }),
                            },
                          ],
                        })(
                          <Select
                            labelInValue
                            style={{ width: '100%' }}
                            onChange={this.handleProvinceChange}
                            placeholder={formatMessage({
                              id: 'yeeorder.please-select',
                            })}
                          >
                            {provinceList.map(({ id, name }) => (
                              <Option key={id} value={id}>
                                {name}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem>
                        {getFieldDecorator(OfficeAddressCity.key, {
                          initialValue: {
                            key: qualityChina[OfficeAddressCity.key],
                            label: qualityChina[`${OfficeAddressCity.key}Name`],
                          },
                          validateFirst: true,
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: OfficeAddressCity.required }),
                            },
                          ],
                        })(
                          <Select
                            labelInValue
                            style={{ width: '100%' }}
                            onChange={this.handleCityChange}
                            placeholder={formatMessage({
                              id: 'yeeorder.please-select',
                            })}
                          >
                            {cityList.map(({ id, name }) => (
                              <Option key={id} value={id}>
                                {name}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem>
                        {getFieldDecorator(OfficeAddressDis.key, {
                          initialValue: {
                            key: qualityChina[OfficeAddressDis.key],
                            label: qualityChina[`${OfficeAddressDis.key}Name`],
                          },
                          validateFirst: true,
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: OfficeAddressDis.required }),
                            },
                          ],
                        })(
                          <Select
                            labelInValue
                            style={{ width: '100%' }}
                            placeholder={formatMessage({
                              id: 'yeeorder.please-select',
                            })}
                          >
                            {districtList.map(({ id, name }) => (
                              <Option key={id} value={id}>
                                {name}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24}>
                <FormItem label={formatMessage({ id: DetailAddress.label })}>
                  {getFieldDecorator(DetailAddress.key, {
                    initialValue: qualityChina[DetailAddress.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: DetailAddress.required,
                        }),
                      },
                      {
                        max: maxCharacters,
                        message: lenErrMessage({ max: maxCharacters }),
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
                <FormItem label={formatMessage({ id: BusinessType.label })}>
                  {getFieldDecorator(BusinessType.key, {
                    initialValue: qualityChina[BusinessType.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: BusinessType.required,
                        }),
                      },
                    ],
                  })(
                    <Select placeholder={formatMessage({ id: 'yeeorder.please-select' })}>
                      {businessType.map(({ value, text }) => (
                        <Option key={value} value={value}>
                          {text}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: ListedCompany.label })}>
                  {getFieldDecorator(ListedCompany.key, {
                    initialValue: qualityChina[ListedCompany.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: ListedCompany.required,
                        }),
                      },
                    ],
                  })(
                    <Select placeholder={formatMessage({ id: 'yeeorder.please-select' })}>
                      {listedStatus.map(({ value, text }) => (
                        <Option key={value} value={value}>
                          {text}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: AnnualRevenue.label })}>
                  {getFieldDecorator(AnnualRevenue.key, {
                    initialValue: qualityChina[AnnualRevenue.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: AnnualRevenue.required,
                        }),
                      },
                    ],
                  })(
                    <Select placeholder={formatMessage({ id: 'yeeorder.please-select' })}>
                      {annualRevenueType.map(({ value, text }) => (
                        <Option key={value} value={value}>
                          {text}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: Employees.label })}>
                  {getFieldDecorator(Employees.key, {
                    initialValue: qualityChina[Employees.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: Employees.required,
                        }),
                      },
                    ],
                  })(
                    <Select placeholder={formatMessage({ id: 'yeeorder.please-select' })}>
                      {employees.map(({ value, text }) => (
                        <Option key={value} value={value}>
                          {text}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: FactorySize.label })}>
                  {getFieldDecorator(FactorySize.key, {
                    initialValue: qualityChina[FactorySize.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: FactorySize.required,
                        }),
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      autoComplete='off'
                      placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: NoProductionLines.label })}>
                  {getFieldDecorator(NoProductionLines.key, {
                    initialValue: qualityChina[NoProductionLines.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: NoProductionLines.required,
                        }),
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      autoComplete='off'
                      placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: NoEquipment.label })}>
                  {getFieldDecorator(NoEquipment.key, {
                    initialValue: qualityChina[NoEquipment.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: NoEquipment.required,
                        }),
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      autoComplete='off'
                      placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label={formatMessage({ id: AnnualExportVolume.label })}>
                  {getFieldDecorator(AnnualExportVolume.key, {
                    initialValue: qualityChina[AnnualExportVolume.key],
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: AnnualExportVolume.required,
                        }),
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <FormItem label={formatMessage({ id: AnnualProduction.label })}>
                  {getFieldDecorator(AnnualProduction.key, {
                    initialValue: annualProduction,
                  })(<TableForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16} type='flex'>
              <Col>
                <FormItem label={formatMessage({ id: OurCustomer.label })}>
                  {getFieldDecorator(OurCustomer.key, {
                    initialValue: ourCustomer,
                  })(
                    <>
                      {ourCustomer.map(item => (
                        <Tag
                          style={{
                            height: '32px',
                            lineHeight: '32px',
                            background: '#fff',
                            borderStyle: 'dashed',
                          }}
                          key={item.id}
                        >
                          {item.name}
                        </Tag>
                      ))}
                      <Button type='primary' onClick={this.toggleDialog}>
                        {formatMessage({ id: 'profile.select-country' })}
                      </Button>
                    </>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <BottomPanel>
              <Button onClick={() => this.handleCancel()}>
                <FormattedMessage id='yeeorder.Cancel' />
              </Button>
              <Button type='primary' htmlType='submit' style={{ marginLeft: 8 }}>
                <FormattedMessage id='yeeorder.Submit' />
              </Button>
            </BottomPanel>
          </Form>
        </Card>
        <div style={{ height: 60 }}></div>
        {modalVisible && <SelectCountry {...modelProps} />}
      </>
    );
  }
}

export default Form.create()(connect(({ user }) => ({ user }))(EditNoLicense));
