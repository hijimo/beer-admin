import { formatMessage } from 'umi-plugin-react/locale';
import _get from 'lodash/get';
import { PaymentType, PaymentKeys } from './enum';

const { FullPayment, InitialPaymentRate, RemainingPayment } = PaymentKeys;
export const formatPaymentInfo = data => {
  const intialRemainFlag = _get(data, 'intialRemainFlag', 0);
  const fullProof = _get(data, 'fullProof', []);
  const totalAmountText = _get(data, 'totalAmountText');
  const intialProof = _get(data, 'orderPayPlanDTO.intialProof', []);
  const remainProof = _get(data, 'orderPayPlanDTO.remainProof', []);
  const finalTermText = _get(data, 'orderPayPlanDTO.finalTermText', '');
  const intialAmountText = _get(data, 'orderPayPlanDTO.intialAmountText', '');
  const percentageTypeText = _get(data, 'orderPayPlanDTO.percentageTypeText', '');
  const remainAmountText = _get(data, 'orderPayPlanDTO.remainAmountText', '');
  const intiaGmtCreate = _get(data, 'orderPayPlanDTO.intiaGmtCreate', '');
  const remainGmtCreate = _get(data, 'orderPayPlanDTO.remainGmtCreate', '');
  const fullGmtCreate = _get(data, 'fullGmtCreate', '');
  let paymentInfo = {
    intialRemainFlag,
    totalAmountText,
  };
  if (intialRemainFlag === PaymentType.full) {
    // 全款支付
    paymentInfo = Object.assign(paymentInfo, {
      paymentOrderList: [
        {
          payTypeText: `${formatMessage({ id: FullPayment.label })}`,
          percentageTypeText: '100%',
          amountText: totalAmountText,
          proofList: fullProof,
          payType: intialRemainFlag,
          gmtCreate: fullGmtCreate,
        },
      ],
    });
  } else if (intialRemainFlag === PaymentType.initial) {
    // 首次支付
    paymentInfo = Object.assign(paymentInfo, {
      paymentOrderList: [
        {
          payTypeText: `${formatMessage({ id: InitialPaymentRate.label })}`,
          percentageTypeText,
          amountText: intialAmountText,
          proofList: intialProof,
          payType: intialRemainFlag,
          gmtCreate: intiaGmtCreate,
        },
        {
          payTypeText: `${formatMessage({ id: RemainingPayment.label })}`,
          finalTermText,
          amountText: remainAmountText,
          proofList: remainProof,
          payType: intialRemainFlag,
          gmtCreate: remainGmtCreate,
        },
      ],
    });
  } else {
    // 二次支付
    paymentInfo = Object.assign(paymentInfo, {
      paymentOrderList: [
        {
          payTypeText: `${formatMessage({ id: InitialPaymentRate.label })}`,
          percentageTypeText,
          amountText: intialAmountText,
          proofList: intialProof,
          payType: intialRemainFlag,
          gmtCreate: intiaGmtCreate,
        },
        {
          payTypeText: `${formatMessage({ id: RemainingPayment.label })}`,
          finalTermText,
          amountText: remainAmountText,
          proofList: remainProof,
          payType: intialRemainFlag,
          gmtCreate: remainGmtCreate,
        },
      ],
    });
  }
  return paymentInfo;
};
