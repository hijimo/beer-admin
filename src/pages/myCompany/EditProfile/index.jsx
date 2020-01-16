import { Form, Button, message, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import BottomPanel from '@/components/BottomPanel';
import { queryCategoryTree, fetchCompany } from '@/services/profile';
import Profile from '../Verification/Profile';

class EditProfile extends Component {
  state = {
    categoryTree: [],
    companyInfo: [],
    loading: false,
  };

  componentDidMount() {
    this.queryCategoryTreeMethod();
    this.fetchCompanyMethod();
  }

  queryCategoryTreeMethod = () => {
    queryCategoryTree().then(async res => {
      const { success, data = [] } = res;
      if (success) {
        const categoryTree = await this.handleCategoryTree(data);
        this.setState({ categoryTree });
      }
    });
  };

  fetchCompanyMethod = () => {
    const {
      user: { currentUser },
    } = this.props;
    const params = { companyNo: currentUser.companyNo };
    this.setState({ loading: true });
    fetchCompany(params).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({
          companyInfo: data,
          loading: false,
        });
      }
    });
  };

  handleCategoryTree = arr => {
    const categoryTree = arr.map(item => {
      const newItem = Object.assign({}, item, {
        title: item.name,
        value: item.id,
      });
      if (Array.isArray(newItem.children)) {
        newItem.children = this.handleCategoryTree(newItem.children);
      }
      return newItem;
    });
    return categoryTree;
  };

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
      content: `${formatMessage({ id: 'profile.profile.Submit-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        that.submitVerification(values);
      },
    });
  };

  submitVerification = async values => {
    const { dispatch } = this.props;
    const {
      ourCustomer,
      companyPhoto = [],
      annualProduction = [],
      paymentPreference = [],
      legalAddressCity,
      legalAddressDis,
      legalAddressPro,
      yearEstablished,
    } = values;
    const preferenceList = await this.getPreferenceList(paymentPreference);
    const params = Object.assign({}, values, {
      ourCustomer: { list: ourCustomer },
      paymentPreference: { preferenceList },
      companyPhoto: { attachments: this.getAttachments(companyPhoto) },
      annualProduction: { list: annualProduction },
      legalAddressPro: legalAddressPro.key,
      legalAddressProName: legalAddressPro.label,
      legalAddressCity: legalAddressCity.key,
      legalAddressCityName: legalAddressCity.label,
      legalAddressDis: legalAddressDis.key,
      legalAddressDisName: legalAddressDis.label,
      yearEstablished: moment(yearEstablished).format('YYYY'),
    });
    dispatch({
      type: 'myCompany/editProfile',
      payload: params,
    });
  };

  getPreferenceList = arr =>
    arr.map(item => {
      const { key, label } = item;
      return { paymentId: key, paymentName: label };
    });

  getAttachments = arr => {
    const attachments = arr.map(item => {
      const { name, size, status, uid, url } = item;
      return { name, size, status, uid, url };
    });
    return attachments;
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

  handleCancel = () => {
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      content: `${formatMessage({ id: 'profile.Cancel-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        router.push('/myCompany?tab=profile');
      },
    });
  };

  render() {
    const { form } = this.props;
    const { categoryTree, companyInfo, loading } = this.state;
    return (
      <PageHeaderWrapper loading={loading}>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          {!!companyInfo.ourCustomer && (
            <Profile isUpdate form={form} categoryTree={categoryTree} companyInfo={companyInfo} />
          )}
          <BottomPanel>
            <Button onClick={() => this.handleCancel()}>
              <FormattedMessage id='yeeorder.Cancel' />
            </Button>
            <Button type='primary' htmlType='submit' style={{ marginLeft: 8 }}>
              <FormattedMessage id='yeeorder.Submit' />
            </Button>
          </BottomPanel>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ myCompany, user }) => ({
    myCompany,
    user,
  }))(EditProfile),
);
