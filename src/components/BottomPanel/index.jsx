import React from 'react';
import { connect } from 'dva';
import clsx from 'classnames';
import styles from './index.less';

function BottomPanel(props) {
  const { menuCollapsed, className, justifyContent = 'flex-end' } = props;
  return (
    <div
      className={clsx(styles.bottomPanel, className)}
      style={{
        left: menuCollapsed ? 80 : 256,
        justifyContent,
        zIndex: 999,
      }}
    >
      {props.children}
    </div>
  );
}

export default connect(({ global }) => ({ menuCollapsed: global.collapsed }))(BottomPanel);
