import React from 'react';
import { Upload, Icon } from 'antd';
import * as PropTypes from 'prop-types';
import { uploadFile } from '@/services/common';

const url = '';
const DEFAULT_SLOT = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>Upload</div>
  </div>
);
export default class FileUpload extends React.Component {
  static propTypes;

  constructor(props) {
    super(props);
    this.handleCustomRequest = this.handleCustomRequest.bind(this);
  }

  async handleCustomRequest(options) {
    const { handleUploadSuccess } = this.props;
    const res = await uploadFile(options);
    if (handleUploadSuccess) {
      handleUploadSuccess([res.data], res);
    }
  }

  render() {
    const { children, disabled, ...props } = this.props;
    return (
      <Upload
        action={url}
        listType='picture-card'
        customRequest={this.handleCustomRequest}
        fileList={this.props.fileList}
        // onPreview={this.handlePreview}
        // onChange={this.hanldeUploadChange}
        disabled={disabled}
        {...props}
      >
        {children || (!disabled && DEFAULT_SLOT)}
      </Upload>
    );
  }
}

FileUpload.propTypes = {
  handleUploadSuccess: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired,
};
