import { Skeleton, Statistic } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../style.less';

const ExtraContent = ({ extraData }) => {
  const loading = extraData && Object.keys(extraData).length;
  if (!loading) {
    return (
      <Skeleton
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }
  const { ingNum, receivedNum, inProcessNum } = extraData;
  return (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <Statistic title={formatMessage({ id: 'home.text.rfq-received' })} value={receivedNum} />
      </div>
      <div className={styles.statItem}>
        <Statistic title={formatMessage({ id: 'home.text.in-rfq' })} value={ingNum} />
      </div>
      <div className={styles.statItem}>
        <Statistic
          title={formatMessage({ id: 'home.text.order-in-process' })}
          value={inProcessNum}
        />
      </div>
    </div>
  );
};

export default ExtraContent;
