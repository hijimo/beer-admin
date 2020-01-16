import { Card, Form, Input, TreeSelect, Modal, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import _get from 'lodash/get';
import UploadList from '@common/components/UploadList';
import { verConf as FORM_KEYS } from '../config';
import { lenErrMessage } from '@/utils/utils';
import './index.less';

const FormItem = Form.Item;
const maxCharacters = 500;

class Verification extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
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

  render() {
    const { previewVisible, previewImage } = this.state;
    const {
      form: { getFieldDecorator },
      categoryTree = [],
      companyInfo,
      isUpdate,
    } = this.props;
    const businessLicImgUrl = _get(companyInfo, 'businessLicImgUrl.attachments', []);
    const offeringFieldIds = _get(companyInfo, 'offeringFieldIds', []);
    const colLayout = {
      lg: { span: 8 },
      md: { span: 12 },
      sm: { span: 24 },
    };
    const {
      CompanyName,
      CorporateRepresentative,
      SocialCreditCode,
      IdentityNumber,
      OfferingFields,
      BusinessLicense,
    } = FORM_KEYS;
    return (
      <>
        <Card bordered={false}>
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem label={formatMessage({ id: CompanyName.label })}>
                {getFieldDecorator(CompanyName.key, {
                  initialValue: isUpdate ? companyInfo[CompanyName.key] : '',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: CompanyName.required,
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
              <FormItem label={formatMessage({ id: CorporateRepresentative.label })}>
                {getFieldDecorator(CorporateRepresentative.key, {
                  initialValue: isUpdate ? companyInfo[CorporateRepresentative.key] : '',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: CorporateRepresentative.required,
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
              <FormItem label={formatMessage({ id: SocialCreditCode.label })}>
                {getFieldDecorator(SocialCreditCode.key, {
                  initialValue: isUpdate ? companyInfo[SocialCreditCode.key] : '',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: SocialCreditCode.required,
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
              <FormItem label={formatMessage({ id: IdentityNumber.label })}>
                {getFieldDecorator(IdentityNumber.key, {
                  initialValue: isUpdate ? companyInfo[IdentityNumber.key] : '',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: IdentityNumber.required,
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
              <FormItem label={formatMessage({ id: OfferingFields.label })}>
                {getFieldDecorator(OfferingFields.key, {
                  initialValue: isUpdate ? offeringFieldIds : undefined,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: OfferingFields.required,
                      }),
                    },
                  ],
                })(
                  <TreeSelect
                    dropdownStyle={{ height: 300 }}
                    maxTagCount={5}
                    treeData={categoryTree}
                    treeCheckable
                    showSearch={false}
                    placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} type='flex'>
            <Col>
              <FormItem label={formatMessage({ id: BusinessLicense.label })}>
                {getFieldDecorator(BusinessLicense.key, {
                  getValueFromEvent: this.normFile,
                  initialValue: isUpdate ? businessLicImgUrl : [],
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: BusinessLicense.required,
                      }),
                    },
                  ],
                })(
                  <UploadList
                    accpet='.png, .jpg, .jpeg'
                    maxLength={1}
                    maxSize={500}
                    listType='picture-card'
                  />,
                )}
                <p className='uploadTips'>{formatMessage({ id: BusinessLicense.tips })}</p>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default Verification;
