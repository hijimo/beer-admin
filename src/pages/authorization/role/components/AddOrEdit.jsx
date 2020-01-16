import React, { useState, useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, TreeSelect, Select, message } from 'antd';
import { connect } from 'dva';
import { getRoleInfo, addRole } from '@/services/roleManage';
import { getUserResource } from '@/services/resourceManage';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const AddOrEdit = props => {
  const [currItem, setCurrItem] = useState({});
  const [roleTypeList, setRoleTypeList] = useState([
    { name: 'supplier', value: 0 },
    { name: 'purcharse', value: 1 },
    { name: 'operators', value: 2 },
  ]);

  const [menuData, setMenuData] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState([]);

  useEffect(() => {
    getUserResource().then(res => {
      if (res.success && res.data) {
        setMenuData(res.data.resourceList);
        setAllIds(res.data.resourceIds);
        props.form.setFieldsValue({ resourceIds: res.data.resourceIds });
      }
    });
    setRoleTypeList([
      { name: 'supplier', value: 0 },
      { name: 'purcharse', value: 1 },
      { name: 'operators', value: 2 },
    ]);
  }, []);

  useEffect(() => {
    if (props.currId) {
      getRoleInfo({ roleNo: props.currId }).then(res => {
        if (res.success && res.data) {
          props.form.setFieldsValue({ resourceIds: res.data.resourceIds });
          setCurrItem(res.data);
        }
      });
    } else if (allIds.length) {
      props.form.setFieldsValue({ resourceIds: allIds });
    }
  }, [props.currId]);

  const treeSelectChange = (value, label, extra) => {
    setHalfCheckedKeys(extra.halfCheckedKeys);
  };

  const deselect = (value, label, extra) => {
    setHalfCheckedKeys(extra.halfCheckedKeys);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          halfResourceIds: halfCheckedKeys.map(item => item / 1),
        };
        if (props.currId) {
          params.roleNo = props.currId;
        }
        addRole(params).then(res => {
          if (res.success) {
            message.success(formatMessage({ id: 'yeeorder.success' }));
            setCurrItem({});
            props.hideModal();
            props.form.resetFields();
            props.form.setFieldsValue({ resourceIds: allIds });
            props.getDataList();
          }
        });
      }
    });
  };

  const cancelSave = () => {
    setCurrItem({});
    props.form.resetFields();
    props.form.setFieldsValue({ resourceIds: allIds });
    props.hideModal();
  };

  const { getFieldDecorator } = props.form;
  const { visible } = props;

  return (
    <Modal
      width={600}
      title={
        props.currId
          ? formatMessage({ id: 'page.role.label.edit.role' })
          : formatMessage({ id: 'page.role.label.add.role' })
      }
      visible={visible}
      onOk={handleSubmit}
      onCancel={cancelSave}
      okText={formatMessage({ id: 'yeeorder.Confirm' })}
      cancelText={formatMessage({ id: 'yeeorder.Cancel' })}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'page.role.table.label.roleName' })}>
          {getFieldDecorator('roleName', {
            initialValue: currItem.roleName || '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'page.role.input.placeholder.roleName' }),
              },
            ],
          })(
            <Input
              maxLength={50}
              placeholder={formatMessage({ id: 'page.role.input.placeholder.roleName' })}
            />,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'page.role.table.label.roleType' })}>
          {getFieldDecorator('roleType', {
            initialValue: props.userType,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'page.role.input.placeholder.roleType' }),
              },
            ],
          })(
            <Select
              disabled
              placeholder={formatMessage({ id: 'page.role.input.placeholder.roleType' })}
            >
              {roleTypeList &&
                roleTypeList.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'page.role.table.label.roleMenu' })}>
          {getFieldDecorator('resourceIds', {
            initialValue: currItem.resourceIds || undefined,
            rules: [
              {
                required: true,
                type: 'array',
                message: formatMessage({ id: 'page.role.input.placeholder.roleMenu' }),
              },
            ],
          })(
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={formatMessage({ id: 'page.role.input.placeholder.roleMenu' })}
              allowClear
              multiple
              treeCheckable
              showCheckedStrategy='SHOW_ALL'
              treeDefaultExpandAll
              maxTagCount={5}
              treeData={menuData}
              onSelect={treeSelectChange}
              onDeselect={deselect}
            />,
          )}
        </Form.Item>

        <Form.Item label={formatMessage({ id: 'page.role.table.label.roleDesc' })}>
          {getFieldDecorator('roleDescription', {
            initialValue: currItem.roleDescription || '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'page.role.input.placeholder.roleDesc' }),
              },
            ],
          })(
            <Input.TextArea
              rows={3}
              maxLength={200}
              placeholder={formatMessage({ id: 'page.role.input.placeholder.roleDesc' })}
            />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = state => ({
  userType: state.user.currentUser.userType,
});
export default connect(mapStateToProps)(Form.create()(AddOrEdit));
