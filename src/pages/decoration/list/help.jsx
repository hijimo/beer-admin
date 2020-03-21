import React from 'react';
import img1 from '@/assets/help/1.jpg';
import img2 from '@/assets/help/2.jpg';
import img3 from '@/assets/help/3.jpg';
import img4 from '@/assets/help/4.jpg';
import img5 from '@/assets/help/5.jpg';
import styles from './help.less';

const DecorationHelp = () => {
  return (
    <div className={styles.help}>
      <img src={img1} />
      <img src={img2} />
      <img src={img3} />
      <img src={img4} />
      <img src={img5} />
    </div>
  );
};

export default DecorationHelp;
