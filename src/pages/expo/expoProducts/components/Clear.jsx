import { Modal } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';

class Clear extends Component {
  handleOk = () => {
    this.props.clearOnOk();
  };

  handleCancel = () => {
    this.props.clearOnCancel();
  };

  render() {
    const { visible } = this.props;

    return (
      <Modal
        title={formatMessage({ id: 'expo-products.remove-title' })}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <p>{formatMessage({ id: 'expo-products.remove-content' })}</p>
      </Modal>
    );
  }
}

export default Clear;
