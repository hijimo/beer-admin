import { Form } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import _get from 'lodash/get';
import { fetchQualityChina, fetchCompany } from '@/services/profile';
import EditHasLicense from './EditHasLicense';
import EditNoLicense from './EditNoLicense';

const HasLicense = 2;

@connect(({ user }) => ({
  userInfo: user.currentUser,
}))
class EditQualityChina extends Component {
  state = {
    qualityChina: {},
  };

  componentDidMount() {
    this.fetchQualityChinaMethod();
  }

  fetchQualityChinaMethod = () => {
    const { userInfo } = this.props;
    const params = { companyNo: userInfo.companyNo };
    const type = _get(this.props, 'location.query.type', '1');
    const hasLicense = Number(type) === HasLicense;
    fetchQualityChina(params).then(res => {
      const { success, data } = res;
      if (success) {
        if (data.contact || data.zjCertValid) {
          this.setState({
            qualityChina: data,
          });
        } else if (hasLicense) {
          this.setState({
            qualityChina: {},
          });
        } else {
          this.fetchCompanyMethod();
        }
      }
    });
  };

  fetchCompanyMethod = () => {
    const { userInfo } = this.props;
    const params = { companyNo: userInfo.companyNo };
    fetchCompany(params).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({
          qualityChina: data,
        });
      }
    });
  };

  render() {
    const { qualityChina = {} } = this.state;
    const type = _get(this.props, 'location.query.type', '1');
    const hasLicense = Number(type) === HasLicense;
    return (
      <PageHeaderWrapper>
        {/* {hasLicense && (qualityChina.id && <EditHasLicense qualityChina={qualityChina} />)} */}
        {hasLicense && <EditHasLicense qualityChina={qualityChina} />}
        {!hasLicense && (qualityChina.id && <EditNoLicense qualityChina={qualityChina} />)}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(EditQualityChina);
