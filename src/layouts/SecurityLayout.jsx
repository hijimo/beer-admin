import { Modal } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import PageLoading from '@/components/PageLoading';

const UNVERIFIED = 0; // 未认证
const AUDITING = 1; // 认证中
// const VERIFIED = 2; // 认证通过
const FAILED = 3; // 认证失败
class SecurityLayout extends React.Component {
  state = {
    isReady: false,
    warnVerify: false,
    pathname: '',
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });

    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'myCompany/verifiedCheck',
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { location, verifyStatus } = this.props;
    const { pathname, warnVerify } = this.state;
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
    // 第一次进入时，记录下路径
    if (!pathname) {
      this.setState({ pathname: location.pathname });
      return;
    }
    // 再次进入，路径和上次进入不一样时，销毁Modal
    if (pathname && pathname !== location.pathname) {
      Modal.destroyAll();
      // 提交数据后重新进入时，要刷新页面，并重新设置pathname
      if (
        location.pathname === '/myCompany' &&
        ['/myCompany/EditVerification', '/myCompany/Verification'].includes(pathname)
      ) {
        window.location.reload();
      }
      this.setState({
        pathname: location.pathname,
      });
      // 从其他页面进入到myCompany模块时，应该重置warnVerify为false
      if (pathname.indexOf('myCompany') === -1) {
        this.setState({
          warnVerify: false,
        });
      }
    }
    if (verifyStatus === null || verifyStatus === undefined) {
      return;
    }
    if (verifyStatus === UNVERIFIED) {
      if (!warnVerify && !['/myCompany/Verification', '/account', '/message'].includes(pathname)) {
        this.setState({ warnVerify: true }, () => {
          this.showConfirmUnverified();
        });
      }
    } else if (verifyStatus !== UNVERIFIED && !warnVerify && pathname === '/myCompany') {
      this.setState({ warnVerify: true }, () => {
        if (verifyStatus === AUDITING) {
          this.showConfirmAuditing();
        } else if (verifyStatus === FAILED) {
          this.showConfirmFailed();
        }
      });
    }
  }

  showConfirmUnverified = () => {
    Modal.info({
      width: '60%',
      title: `${formatMessage({ id: 'profile.notice' })}`,
      content: `${formatMessage({ id: 'profile.not-verified-text' })}`,
      okText: `${formatMessage({ id: 'profile.verify-now' })}`,
      onOk() {
        router.push('/myCompany/Verification');
      },
    });
  };

  showConfirmAuditing = () => {
    Modal.info({
      title: `${formatMessage({ id: 'profile.notice' })}`,
      content: `${formatMessage({ id: 'profile.auditing-text' })}`,
      okText: `${formatMessage({ id: 'yeeorder.ok' })}`,
    });
  };

  showConfirmFailed = () => {
    const { pathname } = this.props.location;
    if (pathname !== '/myCompany') {
      // 不需要取消按钮
      Modal.info({
        title: `${formatMessage({ id: 'profile.notice' })}`,
        content: `${formatMessage({ id: 'profile.fail-text' })}`,
        okText: `${formatMessage({ id: 'yeeorder.to-edit' })}`,
        onOk() {
          router.push('/myCompany/EditVerification');
        },
      });
    } else {
      Modal.confirm({
        title: `${formatMessage({ id: 'profile.notice' })}`,
        content: `${formatMessage({ id: 'profile.fail-text' })}`,
        okText: `${formatMessage({ id: 'yeeorder.to-edit' })}`,
        cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
        onOk() {
          router.push('/myCompany/EditVerification');
        },
        onCancel() {
          router.push('/myCompany');
        },
      });
    }
  };

  render() {
    const { isReady } = this.state;
    const { children, currentUser, verifyStatus, location } = this.props;
    const { pathname } = location;
    const isLogin = currentUser && currentUser.userId;

    // 1.未登录；2.DOM未完成渲染；3.认证信息请求接口未返回数据
    if (!isLogin || !isReady || verifyStatus == null) {
      return <PageLoading />;
    }

    // 1.已登录；2.认证信息不是认证完成；3.页面不是在myCompany/account/message模块，才会重定向到myProfile页面
    if (
      [UNVERIFIED, AUDITING, FAILED].includes(verifyStatus) &&
      (pathname.indexOf('myCompany') === -1 && pathname !== '/account' && pathname !== '/message')
    ) {
      return <Redirect to='/myCompany'></Redirect>;
    }

    return children;
  }
}

export default connect(({ user, myCompany }) => ({
  currentUser: user.currentUser,
  verifyStatus: myCompany.verifyStatus,
}))(SecurityLayout);
