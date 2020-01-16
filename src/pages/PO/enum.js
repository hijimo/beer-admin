// tab切换枚举
export const TabValue = {
  All: -1,
  WaitingForOrder: 1,
  WaitingForPayment: 2,
  WaitingForDelivery: 4,
};
export const TabText = {
  [TabValue.All]: {
    text: 'po.list.all',
    filename: 'all',
    status: undefined,
  },
  [TabValue.WaitingForOrder]: {
    text: 'po.list.waiting-for-order-confirmation',
    filename: 'waitingForOrder',
    status: 1,
  },
  [TabValue.WaitingForPayment]: {
    text: 'po.list.waiting-for-payment-confirmation',
    filename: 'waitingForPayment',
    status: undefined,
  },
  [TabValue.WaitingForDelivery]: {
    text: 'po.list.waiting-for-delivery',
    filename: 'waitingForDelivery',
    status: 4,
  },
};

// 订单状态枚举
export const OrderStatus = {
  Unconfirmed: 1,
  Rejected: 2,
  InQC: 3,
  InProduction: 4,
  InTransit: 5,
  Completed: 6,
  Cancel: 7,
};
export const OrderStatusMap = {
  [OrderStatus.Unconfirmed]: {
    text: 'po.order-status.unconfirmed',
    filename: 'unconfirmed',
    color: 'lightgray',
  },
  [OrderStatus.Rejected]: {
    text: 'po.order-status.rejected',
    filename: 'rejected',
    color: 'red',
  },
  [OrderStatus.InQC]: {
    text: 'po.order-status.in-QC',
    filename: 'inQC',
    color: 'yellow',
  },
  [OrderStatus.InProduction]: {
    text: 'po.order-status.in-production',
    filename: 'inProduction',
    color: 'blue',
  },
  [OrderStatus.InTransit]: {
    text: 'po.order-status.in-transit',
    filename: 'inTransit',
    color: 'lime',
  },
  [OrderStatus.Completed]: {
    text: 'po.order-status.completed',
    filename: 'completed',
    color: 'green',
  },
  [OrderStatus.Cancel]: {
    text: 'po.order-status.cancel',
    filename: 'cancel',
    color: 'gray',
  },
};

export const StepMap = {
  [OrderStatus.Unconfirmed]: {
    value: -1,
    text: 'po.step.confirmed',
  },
  [OrderStatus.Rejected]: {
    value: 0,
    text: 'po.order-status.rejected',
  },
  [OrderStatus.Canceled]: {
    value: 0,
    text: 'po.step.canceled',
  },
  [OrderStatus.InQC]: {
    value: 1,
    text: 'po.order-status.in-QC',
  },
  [OrderStatus.InProduction]: {
    value: 2,
    text: 'po.order-status.in-production',
  },
  [OrderStatus.InTransit]: {
    value: 3,
    text: 'po.order-status.in-transit',
  },
  [OrderStatus.Completed]: {
    value: 4,
    text: 'po.order-status.completed',
  },
};

// 支付状态枚举
export const PayStatusValue = {
  None: 0,
  TobePaid: 1,
  PaymentConfirmation: 2,
  RemainingTobePaid: 3,
  Paid: 4,
};
export const PayStatusMap = {
  [PayStatusValue.TobePaid]: {
    text: 'po.pay-status.to-be-paid',
    filename: 'tobePaid',
    color: 'lightgray',
  },
  [PayStatusValue.PaymentConfirmation]: {
    text: 'po.pay-status.payment-confirmation',
    filename: 'paymentConfirmation',
    color: 'orange',
  },
  [PayStatusValue.RemainingTobePaid]: {
    text: 'po.pay-status.remaining-to-be-paid',
    filename: 'pemainingTobePaid',
    color: 'yellow',
  },
  [PayStatusValue.Paid]: {
    text: 'po.pay-status.paid',
    filename: 'paid',
    color: 'green',
  },
};

export const QcStatus = {
  Auditing: 3,
  Pass: 1,
  Fail: 2,
};

// po management列表字段
export const ListKeys = {
  PONo: {
    key: 'orderNo',
    text: 'po.list.po-no',
  },
  PoRaiseDate: {
    key: 'gmtCreate',
    text: 'po.list.po-raise-date',
  },
  LastUpdate: {
    key: 'gmtUpdate',
    text: 'po.list.last-update',
  },
  Buyer: {
    key: 'companyName',
    text: 'po.list.buyer',
  },
  IncoTerms: {
    key: 'incoTerms',
    text: 'po.list.inco-terms',
  },
  Amount: {
    key: 'totalAmount',
    text: 'po.list.amount',
  },
  Status: {
    key: 'status',
    text: 'po.list.status',
  },
  PayStatus: {
    key: 'payStatus',
    text: 'po.list.pay-status',
  },
};

// po management搜索表单字段
export const FormKeys = {
  PONo: {
    key: 'orderNo',
    label: 'po.list.po-no',
  },
  PORaiseDate: {
    key: 'poRaiseDate',
    label: 'po.list.po-raise-date',
  },
  Buyer: {
    key: 'companyName',
    label: 'po.list.buyer',
  },
  Status: {
    key: 'status',
    label: 'po.list.status',
  },
  Overdue: {
    key: 'overdueFlag',
    label: 'po.list.overdue',
  },
};

// po management页面弹框类型枚举
export const ModalType = {
  Deliver: 'Deliver',
  PaymentConfirm: 'PaymentConfirm',
  Confirm: 'Confirm',
  Reject: 'Reject',
};
export const ModalTypeMap = {
  [ModalType.Deliver]: {
    title: 'po.action.deliver',
  },
  [ModalType.PaymentConfirm]: {
    title: 'po.pay-status.payment-confirmation',
  },
  [ModalType.Confirm]: {
    title: 'yeeorder.Confirm',
  },
  [ModalType.Reject]: {
    title: 'yeeorder.Reject',
  },
};

// po management页面Confirm弹框字段枚举
export const ConfirmKeys = {
  ProformaInvoice: {
    label: 'po.confirm.proforma-invoice',
    key: 'proformaInvoice',
    tips: 'po.confirm.proforma-invoice.tips',
    required: 'po.confirm.proforma-invoice.required',
  },
};

// po management页面Reject弹框字段枚举
export const RejectKeys = {
  Reason: {
    label: 'po.reject.reason',
    key: 'rejectReason',
    required: 'po.reject.reason.required',
  },
};

// po management页面Deliver弹框字段枚举
export const DeliverKeys = {
  BLDate: {
    label: 'po.deliver.bl-date',
    key: 'blDate',
    required: 'po.deliver.bl-date.required',
  },
  BLProof: {
    label: 'po.deliver.bl-proof',
    key: 'blProofList',
    tips: 'po.deliver.bl-proof.tips',
    required: 'po.deliver.bl-proof.required',
  },
};

// po management页面Payment弹框字段枚举
export const PaymentKeys = {
  TotalAmount: {
    label: 'po.payment.total-amount',
    key: 'totalAmount',
  },
  FullPayment: {
    label: 'po.payment.full-payment',
    key: 'totalAmount',
  },
  FullProof: {
    label: 'po.payment.payment-proof',
    key: 'fullProof',
  },
  InitialPaymentRate: {
    label: 'po.payment.initial-payment',
    key: 'percentageType',
  },
  InitialPaymentText: {
    key: 'intialAmount',
  },
  InitialProof: {
    label: 'po.payment.payment-proof',
    key: 'initialProof',
  },
  RemainingPayment: {
    label: 'po.payment.remaining-payment',
    key: 'remainAmount',
  },
  RemainingTerms: {
    key: 'remainPayType',
  },
  RemainingProof: {
    label: 'po.payment.payment-proof',
    key: 'remainingProof',
  },
};

export const PaymentType = {
  initial: 1,
  remaining: 2,
  full: 3,
};

export const PaymentConfirmStatus = {
  Confirmed: 1, // 供应商已确认
  UnConfirmed: 0, // 供应商未确认
};

export const TabKeys = {
  PoInomation: 'PoInomation',
  Logistics: 'Logistics',
  Log: 'Log',
};

export const TabKeysMap = {
  [TabKeys.PoInomation]: 'po.detail.tab.po-inomation',
  [TabKeys.Logistics]: 'po.detail.tab.bl',
  [TabKeys.Log]: 'po.detail.tab.log',
};

export const Detailkeys = {
  PONo: {
    key: 'orderNo',
    label: 'po.detail.po-no',
  },
  PORaiseDate: {
    key: 'gmtCreate',
    label: 'po.detail.po-raise-date',
  },
  Status: {
    key: 'status',
    label: 'po.detail.status',
  },
  OverdueFlag: {
    key: 'overdueFlag',
  },
  Reason: {
    key: 'rejectReason',
    label: 'po.detail.reason',
  },
  PayStatus: {
    key: 'payStatus',
    label: 'po.detail.pay-status',
  },
  RFQNo: {
    key: 'rfqNo',
    label: 'po.detail.rfq-no',
  },
  QCResult: {
    key: 'qcResult',
    label: 'po.detail.qc-result',
  },
  QCReport: {
    key: 'qcReport',
    label: 'po.detail.qc-report',
  },
  UploadDate: {
    key: 'gmtUpdate',
    label: 'po.detail.upload-date',
  },
  QCItemResult: {
    key: 'qcResultText',
    label: 'po.detail.result',
  },
  Payment: {
    label: 'po.detail.payment',
  },
  TotalAmount: {
    label: 'po.payment.total-amount',
    key: 'totalAmount',
  },
  InitialPaymentRate: {
    label: 'po.payment.initial-payment',
    key: 'initialRate',
  },
  RemainingPayment: {
    label: 'po.payment.remaining-payment',
    key: 'remainingText',
  },
  FullPayment: {
    label: 'po.payment.full-payment',
    key: 'fullPayment',
  },
  Product: {
    label: 'po.detail.product',
  },
  LineNo: {
    label: 'po.detail.line-no',
  },
  ProductName: {
    label: 'po.detail.product-name',
    key: 'productName',
  },
  Spec: {
    label: 'po.detail.spec',
    key: 'productSpecFrontDTOList',
  },
  Price: {
    label: 'po.detail.price',
    key: 'productPriceText',
  },
  Quantity: {
    label: 'po.detail.quantity',
    key: 'productQuantityText',
  },
  Amount: {
    label: 'po.detail.amount',
    key: 'totalAmountText',
  },
  QC: {
    label: 'po.detail.qc',
    key: 'needQc',
  },
  ProductDetails: {
    label: 'po.detail.spec',
    key: 'productDetails',
  },
  BuyerDetails: {
    label: 'po.detail.buyer-details',
  },
  Buyer: {
    label: 'po.detail.buyer',
    key: 'companyName',
  },
  BuyerContactName: {
    label: 'po.detail.contact-name',
    key: 'companyContact',
  },
  BuyerEmail: {
    label: 'po.detail.buyer-email',
    key: 'companyEmail',
  },
  ShipmentDetails: {
    label: 'po.detail.shipment-details',
  },
  ShipmentContactName: {
    label: 'po.detail.contact-name',
    key: 'consigneeName',
  },
  ShipmentTelephone: {
    label: 'po.detail.shipment-telphone',
    key: 'consigneeTel',
  },
  ShipmentAddress: {
    label: 'po.detail.shipment-address',
    key: 'consigneeAddress',
  },
  TermsConditions: {
    label: 'po.detail.terms-conditions',
  },
  TransportMode: {
    label: 'po.detail.transport-mode',
    key: 'transportModeType',
  },
  IncoTerm: {
    label: 'po.detail.inco-term',
    key: 'incoTerms',
  },
  DestinatipnDueDate: {
    label: 'po.detail.destinatipn-due-date',
    key: 'destinationDate',
  },
  ShippingInstructions: {
    label: 'po.detail.shipping-instructions',
    key: 'shippingInstructions',
  },
  PaymentMethod: {
    label: 'po.detail.payment-method',
    key: 'paymentMethod',
  },
  ProformaInvoice: {
    label: 'po.confirm.proforma-invoice',
    key: 'proformaInvoice',
  },
  ValueAddedServices: {
    label: 'po.detail.value-added-services',
  },
  NeedQC: {
    label: 'po.detail.need-qc',
    key: 'needQc',
  },
  QCAt: {
    label: 'po.detail.qc-at',
    key: 'qcAt',
  },
  QCSpec: {
    label: 'po.detail.qc-spec',
    key: 'qcSpecList',
  },
  BLDate: {
    label: 'po.detail.bl-date',
    key: 'blDate',
  },
  BLProof: {
    label: 'po.detail.bl-proof',
    key: 'blProofList',
  },
  LogDate: {
    label: 'po.detail.log-date',
    key: 'gmtCreate',
  },
  LogOriginal: {
    label: 'po.detail.log-original',
    key: 'beforeModif',
  },
  LogUpdated: {
    label: 'po.detail.log-updated',
    key: 'afterModif',
  },
};
