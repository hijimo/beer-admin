import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import _get from 'lodash/get';
import Verification from './components/Verification';
import Profile from './components/Profile';
import QualityChina from './components/QualityChina';
import { verifiedQChinaCheck, fetchLastCompany } from '@/services/profile';

const VERIFICATION = 'verification';
const PROFILE = 'profile';
const QUALITYCHINA = 'qualityChina';
const UNVERIFIED = 0;

@connect(({ myCompany, user }) => ({
  verifyStatus: myCompany.verifyStatus,
  user,
}))
class MyProfile extends Component {
  state = {
    tabActiveKey: VERIFICATION,
    qualityChinaStatus: UNVERIFIED,
    companyInfo: {},
  };

  componentDidMount() {
    this.setTabActiveKey();
    this.verifiedCheckMethod();
  }

  componentDidUpdate(prevs) {
    if (prevs.verifyStatus !== this.props.verifyStatus) {
      this.verifiedCheckMethod();
    }
  }

  setTabActiveKey = () => {
    const tab = _get(this.props, 'location.query.tab', '');
    if (tab) {
      this.setState({ tabActiveKey: tab });
    }
  };

  fetchCompanyMethod = () => {
    const {
      user: { currentUser },
    } = this.props;
    const params = { companyNo: currentUser.companyNo };
    fetchLastCompany(params).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({ companyInfo: data });
      }
    });
  };

  verifiedCheckMethod = () => {
    const { verifyStatus } = this.props;
    if (verifyStatus !== UNVERIFIED) {
      this.fetchCompanyMethod();
      this.verifiedQChinaCheckmethod();
    }
  };

  verifiedQChinaCheckmethod = () => {
    verifiedQChinaCheck().then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({ qualityChinaStatus: data || UNVERIFIED });
      }
    });
  };

  onTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
  };

  getTabList = () => {
    const { qualityChinaStatus } = this.state;
    const tabList = [
      {
        key: VERIFICATION,
        tab: `${formatMessage({ id: `profile.${VERIFICATION}` })}`,
      },
      {
        key: PROFILE,
        tab: `${formatMessage({ id: `profile.${PROFILE}` })}`,
      },
    ];
    if (qualityChinaStatus !== 0) {
      tabList.push({
        key: QUALITYCHINA,
        tab: `${formatMessage({ id: `profile.${QUALITYCHINA}` })}`,
      });
    }
    return tabList;
  };

  render() {
    const Content = ({ tabActiveKey, companyInfo }) => {
      switch (tabActiveKey) {
        case VERIFICATION:
          return <Verification companyInfo={companyInfo} />;
        case PROFILE:
          return <Profile companyInfo={companyInfo} />;
        case QUALITYCHINA:
          return <QualityChina />;
        default:
          return <Verification companyInfo={companyInfo} />;
      }
    };
    const { tabActiveKey, companyInfo } = this.state;
    const { verifyStatus } = this.props;
    const tabList = this.getTabList();
    return (
      verifyStatus !== UNVERIFIED && (
        <PageHeaderWrapper
          tabActiveKey={tabActiveKey}
          onTabChange={this.onTabChange}
          tabList={tabList}
        >
          <Content tabActiveKey={tabActiveKey} companyInfo={companyInfo} />
        </PageHeaderWrapper>
      )
    );
  }
}

export default MyProfile;
