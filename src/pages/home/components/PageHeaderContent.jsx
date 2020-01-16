import { Avatar, Skeleton } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../style.less';

const PageHeaderContent = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size='large' src={currentUser.userPhoto} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          {`${formatMessage({ id: 'home.text.hi' })}, ${currentUser.userName}!`}
        </div>
        <div>{formatMessage({ id: 'home.text.greeting' })}</div>
      </div>
    </div>
  );
};

export default PageHeaderContent;
