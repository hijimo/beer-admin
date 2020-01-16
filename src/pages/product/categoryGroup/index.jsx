import React, { Component } from 'react';
import { Modal, Card, message, Button, Form, Input } from 'antd';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import DateIn18 from '@common/components/DateIn18';
import GeneralTable from '@common/components/GeneralTable';
import ActionList from '@common/components/ActionList';
import CategoryForm from './components/searchForm';
import { addGroupLeaf, rmGroupLeaf, updateGroupLeaf } from '@/services/product';

const FormItem = Form.Item;

@connect(({ user, product }) => ({
  userInfo: user.currentUser,
  categoryGroup: product.categoryGroup,
}))
class CategoryGroup extends Component {
  state = {
    searchParams: {},
    modelType: 'Add',
    showModal: false,
    loading: false,
  };

  componentDidMount() {
    this.fetchData();
  }

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

  deleteCategory = row => {
    this.modalData = row;
    Modal.confirm({
      title: formatMessage({ id: 'category.delete-title' }),
      content: formatMessage({ id: 'category.delete-content' }),
      okText: formatMessage({ id: 'yeeorder.Confirm' }),
      cancelText: formatMessage({ id: 'yeeorder.Cancel' }),
      okType: 'danger',
      onOk: () => {
        this.rmGroupLeaf();
      },
    });
  };

  addGroupLeaf = values => {
    const params = {
      pid: this.modalData ? this.modalData.id : 0,
      name: values.groupName,
    };
    const {
      form: { resetFields },
    } = this.props;
    addGroupLeaf(params).then(res => {
      const { success } = res;
      if (success) {
        message.success(formatMessage({ id: 'yeeorder.Success' }));
        this.fetchData();
        resetFields();
        this.setState({ showModal: false });
      }
    });
  };

  updateGroupLeaf = values => {
    const params = {
      id: this.modalData.id,
      name: values.groupName,
    };
    const {
      form: { resetFields },
    } = this.props;
    updateGroupLeaf(params).then(res => {
      const { success } = res;
      if (success) {
        message.success(formatMessage({ id: 'yeeorder.success' }));
        this.fetchData();
        resetFields();
        this.setState({ showModal: false });
      }
    });
  };

  submitSaveCategory = e => {
    e.preventDefault();
    const { modelType } = this.state;
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (modelType === 'Add') {
          this.addGroupLeaf(values);
        }
        if (modelType === 'Edit') {
          this.updateGroupLeaf(values);
        }
      }
    });
  };

  addCategory = row => {
    this.modalData = row;
    this.setState({
      showModal: true,
      modelType: 'Add',
    });
  };

  editCategory = row => {
    const { form } = this.props;
    this.modalData = row;
    form.setFieldsValue({
      groupName: row.name,
    });
    this.setState({
      showModal: true,
      modelType: 'Edit',
    });
  };

  cancleSaveCategory = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.setState({ showModal: false });
  };

  actionBtn = row => [
    <a onClick={() => this.editCategory(row)}>{formatMessage({ id: 'yeeorder.Edit' })}</a>,
    <a onClick={() => this.deleteCategory(row)}>{formatMessage({ id: 'yeeorder.Delete' })}</a>,
  ];

  rmGroupLeaf() {
    rmGroupLeaf({ id: this.modalData.id }).then(res => {
      const { success } = res;
      if (success) {
        message.success(formatMessage({ id: 'yeeorder.Success' }));
        this.fetchData();
      }
    });
  }

  fetchData() {
    const { dispatch } = this.props;
    const params = {
      ...this.state.searchParams,
    };
    this.setState({ loading: true });
    dispatch({
      type: 'product/fetchCategoryGroup',
      payload: params,
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { form, categoryGroup } = this.props;
    const { getFieldDecorator } = form;
    const { modelType, showModal, loading } = this.state;
    const columns = [
      {
        title: `${formatMessage({ id: 'category.list.group-name' })}`,
        dataIndex: 'name',
        key: 'groupName',
      },
      {
        title: '',
        key: 'addProup',
        render: row => {
          const { level } = row;
          return level !== 2 ? (
            <Button type='link' onClick={() => this.addCategory(row)}>
              {formatMessage({ id: 'category.list.add-tier-group' })}
            </Button>
          ) : null;
        },
      },
      {
        title: `${formatMessage({ id: 'category.list.update-date' })}`,
        dataIndex: 'gmtUpdate',
        key: 'updateDate',
        render: val => <DateIn18 date={val} />,
      },
      {
        title: `${formatMessage({ id: 'category.list.action' })}`,
        key: 'action',
        render: row => {
          const btnList = this.actionBtn(row);
          return (
            <ActionList
              actions={[
                <Link to={{ pathname: `/product/CategoryGroup/${row.id}` }}>
                  {formatMessage({ id: 'category-products' })}
                </Link>,
                ...btnList,
              ]}
            />
          );
        },
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <CategoryForm handleSearch={this.handleSearch} />
          <Button
            type='primary'
            icon='plus'
            onClick={this.addCategory}
            style={{ marginBottom: 16 }}
          >
            {formatMessage({ id: 'yeeorder.Add' })}
          </Button>
          <GeneralTable
            loading={loading}
            rowKey='id'
            columns={columns}
            dataSource={categoryGroup || []}
            pagination={false}
          />
        </Card>
        <Modal
          title={formatMessage({ id: `yeeorder.${modelType}` })}
          visible={showModal}
          onOk={this.submitSaveCategory}
          onCancel={this.cancleSaveCategory}
        >
          <Form layout='inline' className='addForm'>
            <FormItem label={formatMessage({ id: 'category.form.group-name' })}>
              {getFieldDecorator('groupName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'category.form.group-name-required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'category.form.group-name' })} />)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(CategoryGroup);
