import { Button, Form, Modal, message } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import _get from 'lodash/get';
import router from 'umi/router';
import BottomPanel from '@/components/BottomPanel';
import BasicInfo from './BasicInfo';
import ProductDetails from './ProductDetails';
import SampleInfo from './SampleInfo';
import { rfqQuote, checkRfqFlag } from '@/services/rfq';
import { QuoteKeys } from './enum';

const {
  ProductName,
  ItemNo,
  UnitPrice,
  Quantity,
  UOM,
  MOQ,
  ProductImages,
  ProductDetail,
  OfferSample,
  ExpectedDeliveryDate,
  OfferFreeSample,
  SampleUnitPrice,
  Remark,
  SampleUOM,
} = QuoteKeys;
const ModalType = {
  Submit: Symbol('Submit'),
  Cancel: Symbol('Cancel'),
};
const ModalTypeMap = {
  [ModalType.Submit]: {
    title: 'yeeorder.Submit',
    content: 'rfq.quote.submit-text',
  },
  [ModalType.Cancel]: {
    title: 'yeeorder.Cancel',
    content: 'rfq.quote.cancel-text',
  },
};

@connect(({ user }) => ({ currentUser: user.currentUser }))
class Quote extends Component {
  showModal = (modaltype, values) => {
    const that = this;
    Modal.confirm({
      title: `${formatMessage({ id: ModalTypeMap[modaltype].title })}`,
      content: `${formatMessage({ id: ModalTypeMap[modaltype].content })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        that.handleConfirm(modaltype, values);
      },
    });
  };

  handleConfirm = async (modaltype, values) => {
    if (modaltype === ModalType.Submit) {
      const { inquiryNo } = this.props.match.params;
      checkRfqFlag({ inquiryNo }).then(async res => {
        if (res.success) {
          const params = await this.getParams(values);
          rfqQuote(params).then(({ success }) => {
            if (success) {
              message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
              router.push('/rfq');
            }
          });
        } else {
          router.push('/rfq');
        }
      });
    } else if (modaltype === ModalType.Cancel) {
      router.goBack();
    }
  };

  getParams = values => {
    const needSample = values[OfferSample.key];
    let params = {
      supplierNo: this.props.currentUser.companyNo,
      inquiryNo: this.props.match.params.inquiryNo,
      productName: values[ProductName.key],
      productNo: values[ItemNo.key],
      productPrice: values[UnitPrice.key],
      productQuantity: values[Quantity.key],
      quantityUnit: values[UOM.key],
      minimumQuantity: values[MOQ.key],
      attachmentList: values[ProductImages.key],
      productDetails: values[ProductDetail.key],
      needSample: values[OfferSample.key],
    };
    if (needSample) {
      params = Object.assign(params, {
        sampleInfoVO: {
          gmtDeliveryDate: values[ExpectedDeliveryDate.key].toISOString(),
          offerFreeSample: values[OfferFreeSample.key],
          unitPrice: values[SampleUnitPrice.key],
          remark: values[Remark.key],
          sampleUom: values[SampleUOM.key],
        },
      });
    }
    return params;
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (!this.validateQuanlity(values)) {
          return;
        }
        this.showModal(ModalType.Submit, values);
      }
    });
  };

  validateQuanlity = values => {
    const productQuantity = values[Quantity.key];
    const minimumQuantity = values[MOQ.key];
    if (minimumQuantity > productQuantity) {
      message.error(`${formatMessage({ id: 'rfq.quote.quantity-error' })}`);
    }
    return minimumQuantity <= productQuantity;
  };

  render() {
    const { form, location } = this.props;
    const thirdCategoryId = _get(location, 'query.thirdCategoryId');
    return (
      <PageHeaderWrapper>
        <Form style={{ marginTop: 8 }}>
          <BasicInfo thirdCategoryId={thirdCategoryId} form={form} />
          <ProductDetails form={form} />
          <SampleInfo form={form} />
          <BottomPanel>
            <Button onClick={() => this.showModal(ModalType.Cancel)}>
              <FormattedMessage id='yeeorder.Cancel' />
            </Button>
            <Button type='primary' onClick={this.handleSubmit} style={{ marginLeft: 8 }}>
              <FormattedMessage id='yeeorder.Submit' />
            </Button>
          </BottomPanel>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Quote);
