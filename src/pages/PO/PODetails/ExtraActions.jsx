import React from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { OrderStatus, PayStatusValue, ModalType } from '../enum';

const ExtraActions = ({ poDetail, handleClick }) => {
  const { status, payStatus } = poDetail;
  return (
    <>
      {status === OrderStatus.Unconfirmed && (
        <>
          <Button onClick={() => handleClick(ModalType.Reject)}>
            {formatMessage({ id: 'yeeorder.Reject' })}
          </Button>
          <Button type='primary' onClick={() => handleClick(ModalType.Confirm)}>
            {formatMessage({ id: 'yeeorder.Confirm' })}
          </Button>
        </>
      )}
      {status === OrderStatus.InProduction && (
        <Button type='primary' onClick={() => handleClick(ModalType.Deliver)}>
          {formatMessage({ id: 'po.action.deliver' })}
        </Button>
      )}
      {payStatus === PayStatusValue.PaymentConfirmation && (
        <Button type='primary' onClick={() => handleClick(ModalType.PaymentConfirm)}>
          {formatMessage({ id: 'po.pay-status.payment-confirmation' })}
        </Button>
      )}
    </>
  );
};

export default ExtraActions;
