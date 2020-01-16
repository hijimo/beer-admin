export const ReceivedKeys = {
  Product: {
    label: 'rfq.received.product',
    key: 'productName',
  },
  Buyer: {
    label: 'rfq.received.buyer',
    key: 'purchaseName',
  },
  RFQResealeDate: {
    label: 'rfq.received.rfq-release-date',
    key: 'gmtCreate',
  },
  RFQNO: {
    label: 'rfq.received.rfq-no',
    key: 'inquiryNo',
  },
  ValidTo: {
    label: 'rfq.received.valid-to',
    key: 'gmtValidDate',
  },
  ProductPic: {
    key: 'productUrl',
  },
  ProductName: {
    key: 'productName',
  },
  Category: {
    label: 'rfq.received.category',
    key: 'productCategory',
  },
  Quantity: {
    label: 'rfq.received.quantity',
    key: 'productQuantityUnit',
  },
  PurchaseName: {
    key: 'purchaseName',
  },
  RemainTime: {
    key: 'remainTimeStr',
  },
  QuoteSeats: {
    key: 'quoteSeatsStr',
  },
};

export const QuoteKeys = {
  Product: {
    label: 'rfq.received.product',
    key: 'productName',
  },
  Buyer: {
    label: 'rfq.received.buyer',
    key: 'purchaseName',
  },
  RFQResealeDate: {
    label: 'rfq.received.rfq-release-date',
    key: 'gmtCreate',
  },
  Status: {
    label: 'rfq.quote.status',
    key: 'qutoesStatus',
  },
  RFQNO: {
    label: 'rfq.received.rfq-no',
    key: 'inquiryNo',
  },
  ValidTo: {
    label: 'rfq.received.valid-to',
    key: 'gmtValidDate',
  },
  ProductPic: {
    key: 'productUrl',
  },
  ProductName: {
    key: 'productName',
  },
  Category: {
    label: 'rfq.received.category',
    key: 'productCategory',
  },
  Quantity: {
    label: 'rfq.received.quantity',
    key: 'productQuantityUnit',
  },
  PurchaseName: {
    key: 'purchaseName',
  },
  InquiryStatus: {
    key: 'inquiryStatus',
  },
};

export const RfqStatus = {
  Auditing: 1,
  Pass: 2,
  Fail: 3,
  Offering: 4,
  Canceled: 5,
  Completed: 6,
};

export const RfqStatusMap = {
  [RfqStatus.Auditing]: {
    value: 1,
    filaname: 'auditing',
  },
  [RfqStatus.Pass]: {
    value: 2,
    filaname: 'pass',
  },
  [RfqStatus.Fail]: {
    value: 3,
    filaname: 'fail',
  },
  [RfqStatus.Offering]: {
    value: 4,
    filaname: 'offering',
  },
  [RfqStatus.Canceled]: {
    value: 5,
    filaname: 'canceled',
  },
  [RfqStatus.Completed]: {
    value: 6,
    filaname: 'completed',
  },
};

export const QutoesStatus = {
  HasQutoed: 1,
  UnQutoed: 0,
};

export const RfqDetailKeys = {
  Status: {
    label: 'rfq.quote.status',
    key: 'inquiryStatus',
  },
  RFQNO: {
    label: 'rfq.received.rfq-no',
    key: 'inquiryNo',
  },
  Product: {
    label: 'rfq.received.product',
    key: 'productName',
  },
  Buyer: {
    label: 'rfq.received.buyer',
    key: 'purchaseName',
  },
  Category: {
    label: 'rfq.received.category',
    key: 'categoryName',
  },
  Quantity: {
    label: 'rfq.received.quantity',
    key: 'productQuantity',
  },
  ValidTo: {
    label: 'rfq.received.valid-to',
    key: 'gmtValidDate',
  },
  RFQResealeDate: {
    label: 'rfq.received.rfq-release-date',
    key: 'gmtCreate',
  },
  Description: {
    label: 'rfq.detail.description',
    key: 'productDetails',
  },
  ProductImage: {
    label: 'rfq.detail.product-image',
    key: 'attachmentList',
  },
  OtherRequirement: {
    label: 'rfq.detail.other-requirement',
  },
  IncoTerms: {
    label: 'rfq.detail.incoTerms',
    key: 'incoTerms',
  },
  PreferredPrice: {
    label: 'rfq.detail.preferred-price',
    key: 'preferredPrice',
  },
  PaymentMethod: {
    label: 'rfq.detail.payment-method',
    key: 'paymentMethod',
  },
  PortofLoading: {
    label: 'rfq.detail.port-of-loading',
    key: 'cargoPort',
  },
  NeedSample: {
    label: 'rfq.detail.need-sample',
    key: 'needSample',
  },
  ExpectedDeliveryDate: {
    label: 'rfq.detail.expected-delivery-date',
    key: 'gmtDeliveryDate',
  },
  QuotesQuantity: {
    label: 'rfq.detail.quotes-quantity',
    key: 'quotesQuantity',
  },
  Quote: {
    label: 'rfq.detail.quote',
  },
  QuoteProductName: {
    label: 'rfq.detail.quote-product-name',
    key: 'productName',
  },
  QuoteItemNo: {
    label: 'rfq.detail.quote-item-no',
    key: 'productNo',
  },
  QuoteUnitPrice: {
    label: 'rfq.detail.quote-unit-price',
    key: 'productPrice',
  },
  QuoteProductQuantity: {
    label: 'rfq.detail.quote-product-quantity',
    key: 'productQuantity',
  },
  QuoteMOQ: {
    label: 'rfq.detail.quote-moq',
    key: 'minimumQuantity',
  },
  QuoteProductPhoto: {
    label: 'rfq.detail.quote-product-photo',
    key: 'attachmentList',
  },
  QuoteProductDetails: {
    label: 'rfq.detail.quote-product-details',
    key: 'productDetails',
  },
  Sample: {
    label: 'rfq.detail.sample',
  },
  OfferSample: {
    label: 'rfq.detail.offer-sample',
    key: 'needSample',
  },
  OfferFreeSample: {
    label: 'rfq.detail.offer-free-sample',
    key: 'offerFreeSample',
  },
  UnitPrice: {
    label: 'rfq.detail.unit-price',
    key: 'unitPrice',
  },
  Remark: {
    label: 'rfq.detail.remark',
    key: 'remark',
  },
};
