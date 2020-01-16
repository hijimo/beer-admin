import { Modal, Card, Button, Typography } from 'antd';
import React, { Component } from 'react';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';

const { Title } = Typography;
const NoLicense = 1;
const HasLicense = 2;
class ChooseUpdate extends Component {
  handleCancel = () => {
    this.props.handleCancel();
  };

  handleEdit = val => {
    router.push({
      pathname: '/myCompany/EditQualityChina',
      query: {
        type: val,
      },
    });
  };

  render() {
    const { visible } = this.props;
    return (
      <Modal
        visible={visible}
        title={formatMessage({ id: 'yeeorder.Update' })}
        footer={null}
        onCancel={this.handleCancel}
      >
        <Card bodyStyle={{ width: '100%', textAlign: 'center' }}>
          <Title level={4}>{formatMessage({ id: 'profile.quality-China.updata-text1' })}</Title>
          <Button type='primary' onClick={() => this.handleEdit(NoLicense)}>
            {formatMessage({ id: 'yeeorder.Sign-Up' })}
          </Button>
        </Card>
        <Card style={{ marginTop: 20 }} bodyStyle={{ width: '100%', textAlign: 'center' }}>
          <Title level={4}>{formatMessage({ id: 'profile.quality-China.updata-text2' })}</Title>
          <Button type='primary' onClick={() => this.handleEdit(HasLicense)}>
            {formatMessage({ id: 'yeeorder.Upload' })}
          </Button>
        </Card>
      </Modal>
    );
  }
}

export default ChooseUpdate;
