export const StatusValue = {
  Pass: 1,
  Pending: 3,
  Fail: 2,
};

export const StatusMap = [
  {
    value: 1,
    text: 'Pass',
    // color: '#FFBD56',
    color: 'green',
  },
  {
    value: 3,
    text: 'Pending',
    // color: '#E75490',
    color: 'lightgray',
  },
  {
    value: 2,
    text: 'Fail',
    // color: '#646464',
    color: 'red',
  },
];

export const QcListKeys = {
  QCNO: {
    key: 'qcNo',
    label: 'qc.product.qc-no',
  },
  Supplier: {
    key: 'purchaseName',
    label: 'qc.product.supplier',
  },
  PONo: {
    key: 'orderNo',
    label: 'qc.product.po-no',
  },
  Status: {
    key: 'qcResult',
    label: 'qc.product.status',
  },
  UploadDate: {
    key: 'gmtUpdate',
    label: 'qc.product.upload-date',
  },
  Buyer: {
    key: 'purchaseName',
    label: 'qc.product.buyer',
  },
  UploadingParty: {
    key: 'companyName',
    label: 'qc.product.uploading-party',
  },
  TotalQuantity: {
    key: 'totalQuantity',
    label: 'qc.product.total-quantity',
  },
  InspectedQuantity: {
    key: 'inspectedQuantity',
    label: 'qc.product.inspected-quantity',
  },
  FailedQuantity: {
    key: 'failedQuantity',
    label: 'qc.product.failed-quantity',
  },
  QCResult: {
    key: 'qcResult',
    label: 'qc.product.qc-result',
  },
  Action: {
    label: 'qc.product.action',
  },
};

export const QcDetailKeys = {
  QCNO: {
    key: 'qcNo',
  },
  QCResult: {
    key: 'qcResult',
    label: 'qc.detail.qc-result',
  },
  TotalQuantity: {
    key: 'totalQuantity',
    label: 'qc.detail.total-quantity',
  },
  InspectedQuantity: {
    key: 'inspectedQuantity',
    label: 'qc.detail.inspected-quantity',
  },
  FailedQuantity: {
    key: 'failedQuantity',
    label: 'qc.detail.failed-quantity',
  },
  Result: {
    key: 'qcResult',
    label: 'qc.detail.result',
  },
  UploadingParty: {
    key: 'companyName',
    label: 'qc.detail.uploading-party',
  },
  UploadDate: {
    key: 'gmtUpdate',
    label: 'qc.detail.upload-date',
  },
  Remark: {
    key: 'remark',
    label: 'qc.detail.remark',
  },
  ProductName: {
    key: 'productName',
    label: 'qc.detail.product-name',
  },
  PONO: {
    key: 'orderNo',
    label: 'qc.detail.po-no',
  },
  Spec: {
    key: 'spec',
    label: 'qc.detail.spec',
  },
  Buyer: {
    key: 'purchaseName',
    label: 'qc.detail.buyer',
  },
  PoRaiseData: {
    key: 'poRaiseDate',
    label: 'qc.detail.po-raise-date',
  },
};
