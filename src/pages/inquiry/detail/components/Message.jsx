import React from 'react';
import { Divider, Descriptions } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames';
import DateIn18 from '@common/components/DateIn18';
import UploadList from '@common/components/UploadList';
import { ContactType, InquiryType } from '../enum';
import styles from '../index.less';

const Message = ({ item, inquiryType }) => {
  const {
    contactName,
    gmtCreate,
    contactInfo,
    productName,
    productQuantity,
    productQuantityUnitText,
    attachmentVOList,
    contactType,
  } = item;
  return (
    <div className={styles.message}>
      <span className={styles['message-time']}>
        {gmtCreate ? <DateIn18 date={gmtCreate} fullTime /> : '--'}
      </span>
      <span className={styles['message-name']}>{contactName || '--'}</span>
      <div
        className={classnames(
          styles['message-content'],
          contactType === ContactType.Purchaser ? styles.isme : styles.other,
        )}
      >
        {inquiryType === InquiryType.Product && productName ? (
          <>
            <Descriptions>
              <Descriptions.Item label={formatMessage({ id: 'yeeorder.product' })}>
                {productName || '--'}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label={formatMessage({ id: 'yeeorder.quantity' })}>
                {`${productQuantity || '--'} / ${productQuantityUnitText || '--'}`}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <span style={{ color: 'rgba(0, 0, 0, 1)' }}>{contactInfo}</span>
            <Divider />
            {attachmentVOList && attachmentVOList.length && (
              <Descriptions>
                <Descriptions.Item
                  className={attachmentVOList.length ? styles.imgRow : ''}
                  label={formatMessage({ id: 'yeeorder.attachments' })}
                >
                  <UploadList
                    maxLength={1}
                    disabled
                    value={attachmentVOList}
                    listType='picture-card'
                  />
                </Descriptions.Item>
              </Descriptions>
            )}
          </>
        ) : (
          contactInfo
        )}
      </div>
    </div>
  );
};

export default Message;
