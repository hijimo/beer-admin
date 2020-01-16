import { Avatar, Form, Card, Badge, Modal, message, Typography, Tooltip } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import MyProductForm from './MyProductForm';
import { SaleStatus, AuditingStatus, colorsMap } from './enum';
import { upadateSaleStatus, deleteProduct } from '@/services/product';

const { Paragraph } = Typography;
const ModalType = {
  PullOff: 0,
  PullOn: 1,
  Delete: 2,
};
const MODAL_TYPE_MAP = {
  [SaleStatus.PullOn]: {
    text: 'Pull On',
    value: 1,
    message: 'my-product.message.pull-on',
  },
  [SaleStatus.PullOff]: {
    text: 'Pull Off',
    value: 2,
    message: 'my-product.message.pull-off',
  },
  [ModalType.Delete]: {
    text: 'Delete',
    value: 2,
    message: 'my-product.message.delete',
  },
};

@connect(({ product, loading }) => ({
  myProduct: product.myProduct,
  pageLoading: loading.effects['product/fetchMyProduct'],
}))
class TabWrapper extends Component {
  state = {
    modalType: SaleStatus.PullOn,
    modalVisible: false,
    searchParams: {},
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(preProps) {
    if (preProps.activeTab !== this.props.activeTab) {
      this.fetchData();
    }
  }

  getBtnNum = row => {
    const { checkStatus, saleStatus } = row;
    let btnNum = 0;
    const showEdit =
      checkStatus === AuditingStatus.Fail ||
      checkStatus === AuditingStatus.Draft ||
      (checkStatus === AuditingStatus.Success && saleStatus === SaleStatus.PullOff);
    const showDelete = showEdit;
    const showPullOn = saleStatus === SaleStatus.PullOff && checkStatus === AuditingStatus.Success;
    const showPullOff = saleStatus === SaleStatus.PullOn && checkStatus === AuditingStatus.Success;
    if (showEdit) btnNum += 1;
    if (showDelete) btnNum += 1;
    if (showPullOn) btnNum += 1;
    if (showPullOff) btnNum += 1;
    return { showEdit, showDelete, showPullOn, showPullOff, btnNum };
  };

  rightBtn = row => {
    const { showEdit, showDelete, showPullOn, showPullOff } = this.getBtnNum(row);
    const btnList = [
      showEdit && (
        <a onClick={() => this.handleEdit(row)}>{formatMessage({ id: 'yeeorder.Edit' })}</a>
      ),
      showDelete && (
        <a onClick={() => this.handleConfirmModalShow(row, ModalType.Delete)}>
          {formatMessage({ id: 'yeeorder.Delete' })}
        </a>
      ),
      showPullOn && (
        <a onClick={() => this.handleConfirmModalShow(row, ModalType.PullOn)}>
          {formatMessage({ id: 'yeeorder.pull-on' })}
        </a>
      ),
      showPullOff && (
        <a onClick={() => this.handleConfirmModalShow(row, ModalType.PullOff)}>
          {formatMessage({ id: 'yeeorder.pull-off' })}
        </a>
      ),
    ];
    return btnList;
  };

  handleSearch = searchParams => {
    this.setState(
      {
        searchParams,
      },
      () => {
        this.fetchData();
      },
    );
  };

  handleConfirmModalShow = (row, modalType) => {
    this.modalData = row;
    this.setState({ modalVisible: true, modalType });
  };

  handleConfirmModalOk = () => {
    const { modalType } = this.state;
    if (modalType === ModalType.PullOn) {
      upadateSaleStatus({ productSpuId: this.modalData.id, saleStatus: 1 }).then(({ success }) => {
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.fetchData();
            this.props.fetchStatistics();
          });
        }
      });
    }
    if (modalType === ModalType.PullOff) {
      upadateSaleStatus({ productSpuId: this.modalData.id, saleStatus: 0 }).then(({ success }) => {
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.fetchData();
            this.props.fetchStatistics();
          });
        }
      });
    }
    if (modalType === ModalType.Delete) {
      deleteProduct({ productSpuId: this.modalData.id }).then(({ success }) => {
        if (success) {
          message.success(formatMessage({ id: 'yeeorder.Success' }));
          this.setState({ modalVisible: false }, () => {
            this.fetchData();
            this.props.fetchStatistics();
          });
        }
      });
    }
  };

  handleConfirmModalCancel = () => {
    this.setState({ modalVisible: false });
  };

  handlePageChange = ({ current, pageSize }) => {
    this.fetchData({
      pageNo: current,
      pageSize,
    });
  };

  renderConfirmModal = () => {
    const { modalVisible, modalType } = this.state;
    const title = modalType !== undefined && MODAL_TYPE_MAP[modalType].text;
    const modalText = modalType !== undefined ? MODAL_TYPE_MAP[modalType].message : 'no message';
    return (
      <Modal
        title={title}
        visible={modalVisible}
        onCancel={this.handleConfirmModalCancel}
        onOk={this.handleConfirmModalOk}
      >
        <FormattedMessage id={modalText} />
      </Modal>
    );
  };

  showDetail = row => {
    const { checkStatus } = row;
    if (checkStatus === AuditingStatus.Draft) {
      return;
    }
    router.push(`/product/MyProduct/${row.id}/detail`);
  };

  handleEdit = row => router.push(`/product/MyProduct/${row.id}/edit`);

  fetchData = (
    pageInfo = {
      pageNo: 1,
      pageSize: 10,
    },
  ) => {
    const { dispatch, activeTab } = this.props;
    const { searchParams } = this.state;
    const params = {
      compStatus: activeTab,
      ...pageInfo,
      ...searchParams,
    };
    dispatch({
      type: 'product/fetchMyProduct',
      payload: params,
    });
  };

  render() {
    const { myProduct, pageLoading } = this.props;
    const { current, pageSize } = myProduct.pagination;
    const columns = [
      {
        className: 'nowrap',
        title: `${formatMessage({ id: 'yeeorder.No.' })}`,
        width: 10,
        fixed: 'left',
        render: (text, row, index) => `${(current - 1) * pageSize + (index + 1)}`,
        key: 'index',
      },
      {
        dataIndex: 'spuNo',
        title: `${formatMessage({ id: 'my-product.list.product-No' })}`,
      },
      {
        title: `${formatMessage({ id: 'my-product.list.product-name' })}`,
        dataIndex: 'picture',
        render: val => (
          <Avatar
            shape='square'
            size={80}
            src={val ? val.url : 'https://img.yeeorder.com/kf/D0289DC0A46FC5B15B3363FFA78CF6C7.png'}
            alt='error'
          />
        ),
        width: 100,
      },
      {
        dataIndex: 'name',
        width: 200,
        render: val => (
          <Tooltip placement='topLeft' title={val}>
            <Paragraph ellipsis={{ rows: 2 }}>{val || '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: `${formatMessage({ id: 'my-product.list.category' })}`,
        dataIndex: 'categoryNamePath',
        width: 200,
        render: val => (
          <Tooltip placement='topLeft' title={val && val.join(' > ')}>
            <Paragraph ellipsis={{ rows: 2 }}>{val ? val.join(' > ') : '--'}</Paragraph>
          </Tooltip>
        ),
      },
      {
        title: `${formatMessage({ id: 'my-product.list.group' })}`,
        dataIndex: 'groupNamePaths',
        width: 200,
        render: val => (
          <Tooltip placement='topLeft' title={val && val.map(t => t.join(' > ')).join(', ')}>
            <Paragraph ellipsis={{ rows: 2 }}>
              {val ? val.map(t => t.join(' > ')).join(', ') : '--'}
            </Paragraph>
          </Tooltip>
        ),
      },
      {
        title: `${formatMessage({ id: 'my-product.list.price' })}`,
        dataIndex: 'price',
        render: val => (val ? `$${val}` : '--'),
        align: 'right',
      },
      {
        title: `${formatMessage({ id: 'my-product.list.uom' })}`,
        dataIndex: 'uomText',
      },
      {
        title: `${formatMessage({ id: 'my-product.list.last-update' })}`,
        dataIndex: 'gmtUpdate',
        render: val => <DateIn18 date={val} />,
      },
      {
        title: `${formatMessage({ id: 'my-product.list.status' })}`,
        dataIndex: 'saleStatusText',
        render: (val, row) => (
          <div>
            <Badge color={colorsMap[row.checkStatus]} text={row.checkStatusText} />
            {row.checkStatus === AuditingStatus.Success && (
              <div style={{ marginLeft: 15 }}>{val}</div>
            )}
          </div>
        ),
      },
      {
        className: 'nowrap',
        title: `${formatMessage({ id: 'my-product.list.action' })}`,
        key: 'action',
        width: 10,
        fixed: 'right',
        render: row => {
          const { btnNum } = this.getBtnNum(row);
          const { checkStatus } = row;

          const btnList = btnNum >= 1 ? this.rightBtn(row) : [];
          const computedBtnList = [
            <a
              className={`${checkStatus === AuditingStatus.Draft && 'draft'}`}
              onClick={() => this.showDetail(row)}
            >
              {formatMessage({ id: 'yeeorder.Details' })}
            </a>,
            ...btnList,
          ];

          return checkStatus === AuditingStatus.Draft ? (
            <ActionList
              actions={[
                <a onClick={() => this.handleEdit(row)}>
                  {formatMessage({ id: 'yeeorder.Edit' })}
                </a>,
                <a onClick={() => this.handleConfirmModalShow(row, ModalType.Delete)}>
                  {formatMessage({ id: 'yeeorder.Delete' })}
                </a>,
              ]}
            />
          ) : (
            <ActionList actions={computedBtnList} />
          );
        },
      },
    ];
    return (
      <Card bordered={false}>
        <MyProductForm handleSearch={this.handleSearch} />
        <GeneralTable
          loading={pageLoading}
          rowKey='id'
          scroll={{ x: true }}
          columns={columns}
          dataSource={myProduct.list}
          pagination={myProduct.pagination}
          onChange={this.handlePageChange}
        />
        {this.renderConfirmModal()}
      </Card>
    );
  }
}

export default Form.create()(TabWrapper);
