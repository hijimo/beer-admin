import React, { PureComponent } from 'react';
import { Badge, Icon } from 'antd';
import { router } from 'umi';
import { connect } from 'dva';
import _get from 'lodash/get';
import styles from './index.less';

@connect(({ common }) => ({
  notice: common.notice,
}))
class NoticeHeader extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'common/fetchNotice',
    // });
  }

  handleClick = () => router.push('/message');

  render() {
    const num = _get(this.props, 'notice.num', null);
    const NoticeBellIcon = <Icon type='bell' className={styles.icon} />;
    return (
      <span className={styles.noticeButton} onClick={this.handleClick}>
        <Badge
          count={num}
          style={{
            boxShadow: 'none',
          }}
          className={styles.badge}
        >
          {NoticeBellIcon}
        </Badge>
      </span>
    );
  }
}

export default NoticeHeader;
