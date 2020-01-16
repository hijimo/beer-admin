import {
  Button,
  InputNumber,
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Descriptions,
  Modal,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import _get from 'lodash/get';
import moment from 'moment';
import UploadList from '@common/components/UploadList';
import YearPicker from '@common/components/YearPicker';
import TableForm from './TableForm';
import SelectCountry from './SelectCountry';
import { fetchDictList, fetchRegion } from '@/services/profile';
import { profileConf as FORM_KEYS } from '../config';
import { lenErrMessage } from '@/utils/utils';

const defaultImg = [
  {
    uid: 'company_default_logo',
    url: 'https://img.yeeorder.com/kf/D0289DC0A46FC5B15B3363FFA78CF6C7.png',
  },
];
const FormItem = Form.Item;
const { Option } = Select;
const typeProvince = 1;
const typeCity = 2;
const typeDistrict = 3;
const maxCharacters = 500;

class Profile extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    modalVisible: false,
    ourCustomer: [],
    dictList: {},
    annualProduction: [],
    provinceList: [],
    cityList: [],
    districtList: [],
  };

  componentDidMount() {
    this.handleRegion();
    this.fetchDictListMethods();
    this.setOurCustomer();
    this.setAnnualProduction();
  }

  handleRegion = () => {
    const { isUpdate } = this.props;
    if (isUpdate) {
      const {
        companyInfo: { legalAddressPro, legalAddressCity },
      } = this.props;
      this.fetchRegionMethod(1, typeProvince);
      this.fetchRegionMethod(legalAddressPro, typeCity);
      this.fetchRegionMethod(legalAddressCity, typeDistrict);
    } else {
      this.fetchRegionMethod(1, typeProvince);
    }
  };

  setOurCustomer = () => {
    const {
      form: { setFieldsValue },
      companyInfo,
    } = this.props;
    const ourCustomer = _get(companyInfo, 'ourCustomer.list', []);
    this.setState({ ourCustomer });
    setFieldsValue({ ourCustomer });
  };

  setAnnualProduction = () => {
    const list = [
      { key: 1, name: undefined, quantity: undefined, uom: undefined },
      { key: 2, name: undefined, quantity: undefined, uom: undefined },
      { key: 3, name: undefined, quantity: undefined, uom: undefined },
    ];
    const annualProduction = _get(this.props, 'companyInfo.annualProduction.list', []);
    annualProduction.forEach((item, index) => {
      list[index] = Object.assign({}, item, { key: index });
    });
    this.setState({
      annualProduction: list,
    });
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

  fetchDictListMethods = async () => {
    const dictKey = [
      'businessType',
      'annualRevenueType',
      'paymentMethod',
      'paymentTerm',
      'employees',
      'listedStatus',
    ];
    const { success, data } = await fetchDictList(dictKey);
    if (success) {
      this.setState({ dictList: data });
    }
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
    this.setState({
      ourCustomer: selectedCountry,
    });
    setFieldsValue({ ourCustomer: selectedCountry });
  };

  handlePreview = async file => {
    this.setState({
      previewImage: file.url,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  getPreferenceList = arr =>
    arr.map(item => ({
      key: item.paymentId,
      label: item.paymentName,
    }));

  render() {
    const {
      modalVisible,
      previewVisible,
      previewImage,
      ourCustomer,
      dictList,
      annualProduction,
      provinceList = [],
      cityList = [],
      districtList = [],
    } = this.state;
    const {
      businessType = [],
      annualRevenueType = [],
      paymentMethod = [],
      paymentTerm = [],
      employees = [],
      listedStatus = [],
    } = dictList;
    const {
      form: { getFieldDecorator },
      companyInfo,
      isUpdate,
    } = this.props;
    const companyPhoto = _get(companyInfo, 'companyPhoto.attachments', []);
    const paymentPreference = _get(companyInfo, 'paymentPreference.preferenceList', []);
    const preferenceList = this.getPreferenceList(paymentPreference);
    const colLayout = {
      lg: { span: 8 },
      md: { span: 12 },
      sm: { span: 24 },
    };
    const {
      CompanyPhoto,
      CompanyTel,
      CompanyNameEng,
      Contact,
      CompanyWebsite,
      BusinessType,
      CompanyFax,
      RegistrationCapital,
      CompanyEmail,
      AnnualRevenue,
      YearEstablished,
      FinancialAccount,
      Employees,
      BusinessScale,
      FactorySize,
      Listed,
      LegalAddressPro,
      LegalAddressCity,
      LegalAddressDis,
      DetailAddress,
      ProductionLine,
      EquipmentNum,
      AnnualExportVolume,
      AnnualProduction,
      PaymentPreference,
      PreferredPaymentTerm,
      LogisticPartner,
      Pol,
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
        <Card
          title={formatMessage({ id: 'profile.basic-information' })}
          bordered={false}
          style={{ marginTop: 24 }}
        >
          <Descriptions column={1}>
            <Descriptions.Item>{formatMessage({ id: 'profile.edit-text' })}</Descriptions.Item>
          </Descriptions>
          <Row gutter={16} type='flex'>
            <Col>
              <FormItem label={formatMessage({ id: CompanyPhoto.label })}>
                {getFieldDecorator(CompanyPhoto.key, {
                  getValueFromEvent: this.normFile,
                  initialValue: isUpdate ? companyPhoto : defaultImg,
                })(<UploadList accpet='.png, .jpg, .jpeg' listType='picture-card' maxLength={1} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: CompanyTel.label })}>
                {getFieldDecorator(CompanyTel.key, {
                  initialValue: isUpdate ? companyInfo[CompanyTel.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: CompanyTel.required,
                      }),
                    },
                    {
                      // 根据用例 可输入20个字符，支持输入特殊字符“+”、“-”及数字
                      pattern: /^(\d|\+|-){0,20}$/,
                      message: formatMessage({ id: CompanyTel.formatError }),
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
              <FormItem label={formatMessage({ id: CompanyNameEng.label })}>
                {getFieldDecorator(CompanyNameEng.key, {
                  initialValue: isUpdate ? companyInfo[CompanyNameEng.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: CompanyNameEng.required,
                      }),
                    },
                    {
                      min: 4,
                      max: 180,
                      message: lenErrMessage({ max: 180, min: 4 }),
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
              <FormItem label={formatMessage({ id: Contact.label })}>
                {getFieldDecorator(Contact.key, {
                  initialValue: isUpdate ? companyInfo[Contact.key] : undefined,
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
              <FormItem label={formatMessage({ id: CompanyWebsite.label })}>
                {getFieldDecorator(CompanyWebsite.key, {
                  initialValue: isUpdate ? companyInfo[CompanyWebsite.key] : undefined,
                  rules: [
                    {
                      type: 'url',
                      message: formatMessage({
                        id: CompanyWebsite.formatError,
                      }),
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
              <FormItem label={formatMessage({ id: BusinessType.label })}>
                {getFieldDecorator(BusinessType.key, {
                  initialValue: isUpdate ? companyInfo[BusinessType.key] : undefined,
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
              <FormItem label={formatMessage({ id: CompanyFax.label })}>
                {getFieldDecorator(CompanyFax.key, {
                  initialValue: isUpdate ? companyInfo[CompanyFax.key] : undefined,
                  rules: [
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
              <FormItem label={formatMessage({ id: RegistrationCapital.label })}>
                {getFieldDecorator(RegistrationCapital.key, {
                  initialValue: isUpdate ? companyInfo[RegistrationCapital.key] : undefined,
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
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: AnnualRevenue.label })}>
                {getFieldDecorator(AnnualRevenue.key, {
                  initialValue: isUpdate ? companyInfo[AnnualRevenue.key] : undefined,
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
              <FormItem label={formatMessage({ id: CompanyEmail.label })}>
                {getFieldDecorator(CompanyEmail.key, {
                  initialValue: isUpdate ? companyInfo[CompanyEmail.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: CompanyEmail.required,
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
                  initialValue: isUpdate ? moment(companyInfo[YearEstablished.key]) : undefined,
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
              <FormItem label={formatMessage({ id: Employees.label })}>
                {getFieldDecorator(Employees.key, {
                  initialValue: isUpdate ? companyInfo[Employees.key] : undefined,
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
              <FormItem label={formatMessage({ id: FinancialAccount.label })}>
                {getFieldDecorator(FinancialAccount.key, {
                  initialValue: isUpdate ? companyInfo[FinancialAccount.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: FinancialAccount.required,
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
              <FormItem label={formatMessage({ id: BusinessScale.label })}>
                {getFieldDecorator(BusinessScale.key, {
                  initialValue: isUpdate ? companyInfo[BusinessScale.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: BusinessScale.required,
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
              <FormItem label={formatMessage({ id: FactorySize.label })}>
                {getFieldDecorator(FactorySize.key, {
                  initialValue: isUpdate ? companyInfo[FactorySize.key] : undefined,
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
              <FormItem label={formatMessage({ id: Listed.label })}>
                {getFieldDecorator(Listed.key, {
                  initialValue: isUpdate ? companyInfo[Listed.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: Listed.required,
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
          </Row>
          <Row gutter={16} type='flex'>
            <Col xl={16} lg={16} md={16} sm={24}>
              <FormItem
                label={formatMessage({ id: 'profile.legal-address' })}
                required
                style={{ marginBottom: 0 }}
              >
                <Row gutter={8} type='flex'>
                  <Col span={8}>
                    <FormItem>
                      {getFieldDecorator(LegalAddressPro.key, {
                        initialValue: isUpdate
                          ? {
                              key: companyInfo[LegalAddressPro.key],
                              label: companyInfo[`${LegalAddressPro.key}Name`],
                            }
                          : undefined,
                        validateFirst: true,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: LegalAddressPro.required }),
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
                      {getFieldDecorator(LegalAddressCity.key, {
                        initialValue: isUpdate
                          ? {
                              key: companyInfo[LegalAddressCity.key],
                              label: companyInfo[`${LegalAddressCity.key}Name`],
                            }
                          : undefined,
                        validateFirst: true,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: LegalAddressCity.required }),
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
                      {getFieldDecorator(LegalAddressDis.key, {
                        initialValue: isUpdate
                          ? {
                              key: companyInfo[LegalAddressDis.key],
                              label: companyInfo[`${LegalAddressDis.key}Name`],
                            }
                          : undefined,
                        validateFirst: true,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: LegalAddressDis.required }),
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
                  initialValue: isUpdate ? companyInfo[DetailAddress.key] : undefined,
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
        </Card>
        <Card title={formatMessage({ id: 'profile.capacity-overview' })} bordered={false}>
          <Row gutter={16}>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: ProductionLine.label })}>
                {getFieldDecorator(ProductionLine.key, {
                  initialValue: isUpdate ? companyInfo[ProductionLine.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: ProductionLine.required,
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
              <FormItem label={formatMessage({ id: EquipmentNum.label })}>
                {getFieldDecorator(EquipmentNum.key, {
                  initialValue: isUpdate ? companyInfo[EquipmentNum.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: EquipmentNum.required,
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
                  initialValue: isUpdate ? companyInfo[AnnualExportVolume.key] : undefined,
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
                  rules: [{ required: true }],
                })(<TableForm />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title={formatMessage({ id: 'profile.payment-logistics' })} bordered={false}>
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: PaymentPreference.label })}>
                {getFieldDecorator(PaymentPreference.key, {
                  initialValue: isUpdate ? preferenceList : [],
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: PaymentPreference.required,
                      }),
                    },
                  ],
                })(
                  <Select
                    mode='multiple'
                    labelInValue
                    placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                  >
                    {paymentMethod.map(({ value, text }) => (
                      <Option key={value} value={value}>
                        {text}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: PreferredPaymentTerm.label })}>
                {getFieldDecorator(PreferredPaymentTerm.key, {
                  initialValue: isUpdate ? companyInfo[PreferredPaymentTerm.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: PreferredPaymentTerm.required,
                      }),
                    },
                  ],
                })(
                  <Select placeholder={formatMessage({ id: 'yeeorder.please-select' })}>
                    {paymentTerm.map(({ value, text }) => (
                      <Option key={value} value={value}>
                        {text}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: LogisticPartner.label })}>
                {getFieldDecorator(LogisticPartner.key, {
                  initialValue: isUpdate ? companyInfo[LogisticPartner.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: LogisticPartner.required,
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
              <FormItem label={formatMessage({ id: Pol.label })}>
                {getFieldDecorator(Pol.key, {
                  initialValue: isUpdate ? companyInfo[Pol.key] : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: Pol.required,
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
            <Col>
              <FormItem label={formatMessage({ id: OurCustomer.label })}>
                {getFieldDecorator(OurCustomer.key)(
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
        </Card>
        <div style={{ height: 60 }}></div>
        <SelectCountry {...modelProps} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default Profile;
