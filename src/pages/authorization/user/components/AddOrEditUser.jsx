import React, { useState, useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, Select, message } from 'antd';
// import { Modal, Form, Input, Select, TreeSelect, message } from 'antd';
import { emailReg } from '@/utils/common';
import { getChildrenInfo, addUser } from '@/services/userManage';
// import { getDeptList } from '@/services/deptManage';
import { getRoleList } from '@/services/roleManage';

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

const { Option } = Select;

const AddOrEditUser = props => {
  const [currItem, setCurrItem] = useState({});
  // const [depOpt, setDepOpt] = useState([]);
  const [roleOpt, setRoleOpt] = useState([]);
  useEffect(() => {
    if (props.currId) {
      getChildrenInfo({ userNo: props.currId }).then(res => {
        if (res.success) {
          setCurrItem(res.data);
        }
      });
    }
  }, [props.currId]);

  useEffect(() => {
    // getDeptList().then(res => {
    //   console.log(res);
    //   if (res.success) {
    //     setDepOpt(res.data.records);
    //   }
    // });
    getRoleList({ pageNo: 1, pageSize: 100, freeze: false }).then(res => {
      if (res.success) {
        setRoleOpt(res.data.records);
      }
    });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          roleNoList: [values.roleNoList],
        };
        if (props.currId) {
          params.userNo = props.currId;
        }
        addUser(params).then(res => {
          if (res.success) {
            message.success(formatMessage({ id: 'yeeorder.success' }));
            props.getDataList();
            setCurrItem({});
            props.form.resetFields();
            props.hideModal();
          }
        });
      }
    });
  };

  const cancelSave = () => {
    props.form.resetFields();
    props.hideModal();
  };

  const { getFieldDecorator } = props.form;
  const { visible } = props;

  return (
    <Modal
      width={600}
      title={
        props.currId
          ? formatMessage({ id: 'page.user.label.edit.user' })
          : formatMessage({ id: 'page.user.label.add.user' })
      }
      visible={visible}
      onOk={handleSubmit}
      onCancel={cancelSave}
      okText={formatMessage({ id: 'yeeorder.Confirm' })}
      cancelText={formatMessage({ id: 'yeeorder.Cancel' })}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'page.user.label.firstName' })}>
          {getFieldDecorator('firstName', {
            initialValue: currItem.firstName || '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'page.user.label.placeholder.firstName' }),
              },
            ],
          })(
            <Input
              maxLength={20}
              placeholder={formatMessage({ id: 'page.user.label.placeholder.firstName' })}
            />,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'page.user.label.lastName' })}>
          {getFieldDecorator('lastName', {
            initialValue: currItem.lastName || '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'page.user.label.placeholder.lastName' }),
              },
            ],
          })(
            <Input
              maxLength={20}
              placeholder={formatMessage({ id: 'page.user.label.placeholder.lastName' })}
            />,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'page.user.label.user.mail' })}>
          {getFieldDecorator('userEmail', {
            initialValue: currItem.userEmail || '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'page.user.label.user.mail.placholder' }),
              },
              {
                pattern: emailReg,
                message: formatMessage({ id: 'page.user.label.user.mail.placholder.tip' }),
              },
            ],
          })(
            <Input
              disabled={!!props.currId}
              maxLength={100}
              placeholder={formatMessage({ id: 'page.user.label.user.mail.placholder' })}
            />,
          )}
        </Form.Item>

        {/* {props.currId ? null : (
          <Form.Item label={formatMessage({ id: 'page.user.label.user.pwd' })}>
            {getFieldDecorator('password', {
              initialValue: currItem.password || '',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'page.user.label.user.pwd.placholder' }),
                },
              ],
            })(
              <Input.Password
                maxLength={30}
                placeholder={formatMessage({ id: 'page.user.label.user.pwd.placholder' })}
              />,
            )}
          </Form.Item>
        )} */}
        <Form.Item label={formatMessage({ id: 'page.user.label.user.mobile' })}>
          {getFieldDecorator('userMobile', {
            initialValue: currItem.userMobile || '',
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'page.user.label.user.mobile.placholder' }),
              },
              {
                pattern: /^(\+)?((\d)+(-)*)+$/,
                message: formatMessage({ id: 'page.user.label.user.mobile.placholder.tip' }),
              },
            ],
          })(
            <Input
              disabled={!!props.currId}
              maxLength={20}
              placeholder={formatMessage({ id: 'page.user.label.user.mobile.placholder' })}
            />,
          )}
        </Form.Item>
        {/* <Form.Item label={formatMessage({ id: 'page.user.label.user.dept' })}>
          {getFieldDecorator('deptNo', {
            initialValue: currItem.deptNo || undefined,
          })(
            <TreeSelect
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              placeholder={formatMessage({ id: 'page.user.label.user.dept.placholder' })}
              allowClear
              treeData={depOpt}
              showCheckedStrategy='SHOW_ALL'
              treeDefaultExpandAll
              // treeNodeLabelProp='deptName'
              maxTagCount={5}
              // treeNodeFilterProp='deptNo'
            />,
          )}
        </Form.Item> */}
        <Form.Item label={formatMessage({ id: 'page.user.label.user.role' })}>
          {getFieldDecorator('roleNoList', {
            initialValue:
              currItem && currItem.roleNoList && currItem.roleNoList.length
                ? currItem.roleNoList[0]
                : undefined,
            rules: [
              {
                required: true,
                // type: 'array',
                message: formatMessage({ id: 'page.user.label.user.role.placholder' }),
              },
            ],
          })(
            <Select
              // mode='multiple'
              placeholder={formatMessage({ id: 'page.user.label.user.role.placholder' })}
              allowClear
            >
              {roleOpt.map(item => (
                <Option key={item.roleNo} value={item.roleNo}>
                  {item.roleName}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(AddOrEditUser);
