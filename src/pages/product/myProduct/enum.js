export const CompStatus = {
  // 1全部 1成功-上架 2成功-下架 3失败 4审核中 5草稿
  All: -1,
  OnShelf: 1,
  OffShelf: 2,
  Fail: 3,
  Auditing: 4,
  Draft: 5,
};

export const statusFilename = {
  [CompStatus.All]: 'all',
  [CompStatus.OnShelf]: 'onShelf',
  [CompStatus.OffShelf]: 'offShelf',
  [CompStatus.Fail]: 'fail',
  [CompStatus.Auditing]: 'auditing',
  [CompStatus.Draft]: 'draft',
};

export const SaleStatus = {
  PullOn: 1,
  PullOff: 0,
};

export const CompStatusMap = {
  // 1全部 1成功-上架 2成功-下架 3失败 4审核中 5草稿
  [CompStatus.All]: 'product.status.all',
  [CompStatus.OnShelf]: 'product.status.on-the-shelves',
  [CompStatus.OffShelf]: 'product.status.off-the-shelves',
  [CompStatus.Fail]: 'product.status.fail',
  [CompStatus.Auditing]: 'product.status.adulting',
  [CompStatus.Draft]: 'product.status.draft',
};

// 审核状态 0草稿 1审核中 2成功 3失败
export const AuditingStatus = {
  Draft: 0,
  Auditing: 1,
  Success: 2,
  Fail: 3,
};
export const AuditingStatusMap = {
  [AuditingStatus.Draft]: 'Draft',
  [AuditingStatus.Auditing]: 'Auditing',
  [AuditingStatus.Success]: 'Success',
  [AuditingStatus.Fail]: 'Fail',
};

export const colorsMap = {
  [AuditingStatus.Draft]: 'rgba(0, 102, 255, 1)',
  [AuditingStatus.Auditing]: 'rgba(255, 102, 0, 1)',
  [AuditingStatus.Success]: '#52C41A',
  [AuditingStatus.Fail]: '#f00',
};
