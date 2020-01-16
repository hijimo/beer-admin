export const StatusValue = {
  Unconfirmed: 1,
  To_Be_Paid: 2,
  In_Production: 3,
  In_Transit: 4,
  Completed: 5,
  Rejected: 6,
  Canceled: 7,
  Payment_Confirmation: 8,
};

export const StatusMap = {
  [StatusValue.Unconfirmed]: {
    text: 'sample.status.unconfirmed',
    color: 'lightgray',
  },
  [StatusValue.To_Be_Paid]: {
    text: 'sample.status.to-be-paid',
    color: 'yellow',
  },
  [StatusValue.In_Production]: {
    text: 'sample.status.in-production',
    color: 'blue',
  },
  [StatusValue.In_Transit]: {
    text: 'sample.status.in-transit',
    color: 'lime',
  },
  [StatusValue.Completed]: {
    text: 'sample.status.completed',
    color: 'green',
  },
  [StatusValue.Rejected]: {
    text: 'sample.status.rejected',
    color: 'red',
  },
  [StatusValue.Canceled]: {
    text: 'sample.status.canceled',
    color: 'gray',
  },
  [StatusValue.Payment_Confirmation]: {
    text: 'sample.status.payment-confirmation',
    color: 'orange',
  },
};

export const ModalType = {
  Confirm: Symbol('Confirm'),
  Reject: Symbol('Reject'),
  Payment: Symbol('Payment'),
  Deliver: Symbol('Deliver'),
  PaymentDetails: Symbol('PaymentDetails'),
};

export const ModalTitle = {
  [ModalType.Confirm]: 'yeeorder.Confirm',
  [ModalType.Reject]: 'yeeorder.Reject',
  [ModalType.Payment]: 'sample.management.paymentConfirmation',
  [ModalType.Deliver]: 'sample.management.deliver',
  [ModalType.PaymentDetails]: 'sample.management.payment-details',
};

export const FormKeys = {
  ProformaInvoice: {
    key: 'paymentProofList',
    label: 'sample.management.proforma-invoice',
  },
  RejectReason: {
    key: 'rejectReason',
    label: 'sample.management.reject-reason',
    required: 'sample.management.reject-reason.required',
  },
  TotalAmount: {
    key: 'totalAmount',
    label: 'sample.management.total-amount',
  },
  PaymentProof: {
    key: 'paymentProof',
    label: 'sample.management.payment-proof',
  },
  DeliveryDate: {
    key: 'actualDeliveryDate',
    label: 'sample.management.delivery-date',
    required: 'sample.management.delivery-date.required',
  },
  LogisticsProvider: {
    key: 'logisticsProvider',
    label: 'sample.management.logistics-provider',
    required: 'sample.management.logistics-provider.required',
  },
  LogisticsNo: {
    key: 'logisticsNo',
    label: 'sample.management.logistics-no',
    required: 'sample.management.logistics-no.required',
  },
};

export const DetailKeys = {
  SampleNO: {
    key: 'sampleNo',
    label: 'sample.detail.sample-no',
  },
  SampleRaiseDate: {
    key: 'gmtCreate',
    label: 'sample.detail.sample-raise-time',
  },
  Status: {
    key: 'sampleStatus',
    label: 'sample.detail.status',
  },
  TotalAmount: {
    key: 'totalAmount',
    label: 'sample.detail.total-amount',
  },
  Buyer: {
    key: 'purchaseName',
    label: 'sample.detail.buyer',
  },
  BuyerContact: {
    key: 'contactName',
    label: 'sample.detail.buyer-contact',
  },
  BuyerEmail: {
    key: 'companyEmail',
    label: 'sample.detail.buyer-email',
  },
  SamplePhoto: {
    key: 'photoList',
  },
  ProductName: {
    key: 'productName',
    label: 'sample.detail.product-name',
  },
  ProductPrice: {
    key: 'productPrice',
    label: 'sample.detail.product-price',
  },
  ProductQuantity: {
    key: 'productQuantity',
    label: 'sample.detail.product-quantity',
  },
  ProductDetail: {
    key: 'sampleDetails',
    label: 'sample.detail.product-detail',
  },
  ConsigneeName: {
    key: 'contactName',
    label: 'sample.detail.consignee-name',
  },
  ConsigneeTel: {
    key: 'contactTelephone',
    label: 'sample.detail.consignee-tel',
  },
  ConsigneeAddress: {
    key: 'contactAddress',
    label: 'sample.detail.consignee-address',
  },
  ProformaInvoice: {
    key: 'proformaInvoiceList',
    label: 'sample.detail.proforma-invoice',
  },
  DeliverDate: {
    key: 'actualDeliveryDate',
    label: 'sample.detail.deliver-date',
  },
  LogisticsProvider: {
    key: 'logisticsProvider',
    label: 'sample.detail.logistics-provider',
  },
  LogisticsNo: {
    key: 'logisticsNo',
    label: 'sample.detail.logistics-no',
  },
  RejectReason: {
    key: 'rejectReason',
    label: 'sample.management.reject-reason',
    required: 'sample.management.reject-reason.required',
  },
};
