import { Form, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import BottomPanel from '@/components/BottomPanel';
import { queryCategoryTree, fetchCompany } from '@/services/profile';
import Verification from '../Verification/Verification';

class EditVerification extends Component {
  state = {
    categoryTree: [],
    companyInfo: [],
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
    fetchCompany(params).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({
          companyInfo: data,
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

  submitConfirm = values => {
    const that = this;
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Submit' })}`,
      content: `${formatMessage({ id: 'profile.Submit-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        that.submitVerification(values);
      },
    });
  };

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        this.submitConfirm(values);
      }
    });
  };

  submitVerification = async values => {
    const { dispatch } = this.props;
    const { offeringFields, businessLicImgUrl } = values;
    const params = Object.assign({}, values, {
      businessLicImgUrl: { attachments: this.getAttachments(businessLicImgUrl) },
      offeringFields: null,
      offeringFieldIds: offeringFields,
    });
    dispatch({
      type: 'myCompany/editVerification',
      payload: params,
    });
  };

  handleCancel = () => {
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      content: `${formatMessage({ id: 'profile.Cancel-text' })}`,
      onOk() {
        router.push('/myCompany?tab=verification');
      },
    });
  };

  getAttachments = arr => {
    const attachments = arr.map(item => {
      const { name, size, status, uid, url } = item;
      return { name, size, status, uid, url };
    });
    return attachments;
  };

  render() {
    const { form } = this.props;
    const { categoryTree, companyInfo } = this.state;
    return (
      <PageHeaderWrapper>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <Verification
            isUpdate
            form={form}
            categoryTree={categoryTree}
            companyInfo={companyInfo}
          />
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
  }))(EditVerification),
);
