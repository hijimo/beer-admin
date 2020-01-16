export const ProductFields = {
  Picture: {
    key: 'productPhoto',
    label: 'inquiry.product.picture',
    required: 'inquiry.product.picture.required',
    tip: 'inquiry.product.picture.tip',
  },
  ProductName: {
    key: 'productName',
    label: 'inquiry.product.name',
    required: 'inquiry.product.name.required',
  },
  Category: {
    key: 'categoryId',
    label: 'inquiry.product.category',
    required: 'inquiry.product.category.required',
  },
  Quantity: {
    key: 'productQuantity',
    label: 'inquiry.product.quantity',
    required: 'inquiry.product.quantity.required',
  },
  UOM: {
    key: 'uom',
  },
  Price: {
    key: 'productPrice',
    label: 'inquiry.product.price',
    required: 'inquiry.product.price.required',
  },
  Currency: {
    key: 'currency',
  },
  Spec: {
    key: 'productSpec',
    label: 'inquiry.product.spec',
    required: 'inquiry.product.spec.required',
    placeholder: 'inquiry.product.spec.placeholder',
  },
};

export const ContactType = {
  Purchaser: 1,
  Supplier: 2,
};

export const InquiryType = {
  Supplier: 1,
  Product: 2,
};
