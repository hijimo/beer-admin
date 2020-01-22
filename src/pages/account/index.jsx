import { Card, Divider } from 'antd';
import React, { PureComponent, Fragment } from 'react';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import _get from 'lodash/get'
import { connect } from 'dva';
import styles from './style.less';
import UpdateDialog from './components/UpdateDialog';
import SecurityView from './components/Security';

@connect(({ user }) => ({
  userInfo: user.currentUser,
}))
class Account extends PureComponent {
  state = {
    dialogType: 'userName',
    dialogVisible: false,
  };

  handleClick = str => {
    this.setState({
      dialogType: str,
      dialogVisible: true,
    });
  };

  hideUpdateDialog = () => {
    this.setState({
      dialogVisible: false,
    });
  };

  getData = () => {
    const { userInfo } = this.props;
    return [
      {
        title: '用户昵称',
        description: (
          <Fragment>
            {_get(userInfo, 'realName')}
          </Fragment>
        ),
        actions: [
          <a key='Modify' onClick={() => this.handleClick('userName')}>
            <FormattedMessage id='app.account.modify' defaultMessage='Modify' />
          </a>,
        ],
      },
      {
        title: formatMessage({ id: 'app.account.email' }),
        description: (
          <Fragment>
            {_get(userInfo, 'email')}
          </Fragment>
        ),
        actions: [
          <a key='Modify' onClick={() => this.handleClick('email')}>
            <FormattedMessage id='app.account.modify' defaultMessage='Modify' />
          </a>,
        ],
      },
      {
        title: '手机',
        description: (
          <Fragment>
             {_get(userInfo, 'mobile')}
          </Fragment>
        ),
        actions: [
          <a key='Modify' onClick={() => this.handleClick('mobile')}>
            <FormattedMessage id='app.account.modify' defaultMessage='Modify' />
          </a>,
        ],
      },
      {
        title: formatMessage({ id: 'app.account.password' }),
        description: `********`,
        actions: [
          <a key='Modify' onClick={() => this.handleClick('password')}>
            <FormattedMessage id='app.account.modify' defaultMessage='Modify' />
          </a>,
        ],
      },
    ];
  };

  render() {
    const { dialogType, dialogVisible } = this.state;
    const { userInfo, dispatch } = this.props;
    return (
      <PageHeaderWrapper className={styles.pageHeader}>
        <div className={styles.main}>
          <GridContent>
            <Card
              title={<FormattedMessage id='app.account.title' defaultMessage='Account' />}
              bordered={false}
            >

              <SecurityView data={this.getData()} />
            </Card>
          </GridContent>
        </div>
        <UpdateDialog
          visible={dialogVisible}
          type={dialogType}
          hideDialog={this.hideUpdateDialog}
          dispatch={dispatch}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Account;
