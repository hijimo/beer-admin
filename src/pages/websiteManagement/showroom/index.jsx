import { Button, Card, Form, message, Icon, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'dva';
import config from '@common/config';
import _get from 'lodash/get';
import UploadList from '@common/components/UploadList';
import { formatMessage } from 'umi-plugin-react/locale';
import { fetchShowroom, saveShowroom } from '@/services/showroom';

const FormItem = Form.Item;
const { mallHost } = config;
let id = 0;

@connect(({ user }) => ({
  userInfo: user.currentUser,
}))
class Showroom extends Component {
  state = {
    keys: [],
    isChange: false,
    canPreview: true,
    canCancel: false,
  };

  componentDidMount() {
    this.fetchShowroomMethod();
  }

  fetchShowroomMethod = () => {
    fetchShowroom().then(res => {
      const { success, data } = res;
      if (success) {
        const certRewardList = _get(data, 'certRewardList.attachments', []);
        const picVcrList = _get(data, 'picVcrList.attachments', []);
        const vrList = _get(data, 'vrList.attachments', []);
        const afterSaleServiceList = _get(data, 'afterSaleServiceList', []);
        const listLength = afterSaleServiceList.length || 1;
        const keys = Array.from({ length: listLength }, (v, k) => k);
        id = afterSaleServiceList.length;
        this.setState({ keys });
        this.props.form.setFieldsValue({
          certRewardList,
          picVcrList,
          vrList,
          afterSaleServiceList,
        });
      }
    });
  };

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        this.saveShowroomMethod(values);
      }
    });
  };

  saveShowroomMethod = values => {
    const { certRewardList = [], picVcrList = [], vrList = [], afterSaleServiceList = [] } = values;
    const {
      userInfo: { companyNo },
    } = this.props;
    const params = {
      companyNo,
      certRewardList: {
        attachments: this.getAttachments(certRewardList),
      },
      picVcrList: {
        attachments: this.getAttachments(picVcrList),
      },
      vrList: {
        attachments: this.getAttachments(vrList),
      },
      afterSaleServiceList: afterSaleServiceList.filter(key => !!key),
    };
    saveShowroom(params).then(res => {
      const { success } = res;
      if (success) {
        message.success(`${formatMessage({ id: 'yeeorder.Success' })}`);
        this.fetchShowroomMethod();
        this.setState({
          canPreview: true,
          isChange: false,
          canCancel: false,
        });
      }
    });
  };

  getAttachments = imgList =>
    imgList.map(({ cover, name, size, status, uid, url, type }) => ({
      cover,
      name,
      size,
      status,
      type,
      uid,
      url,
    }));

  previewShowroom = () => {
    const {
      userInfo: { companyNo },
    } = this.props;
    window.open(`${mallHost}/companies/${companyNo}/showroom`, '_blank');
  };

  handleCancel = () => {
    this.fetchShowroomMethod();
    this.setState({
      isChange: false,
      canPreview: true,
      canCancel: false,
    });
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  onOriginChange = ({ file }) => {
    if (file.status === 'done' || file.status === 'removed') {
      this.setState({
        isChange: true,
        canPreview: false,
        canCancel: true,
      });
    }
  };

  remove = k => {
    const { keys } = this.state;
    if (keys.length === 1) {
      return;
    }
    this.setState({
      keys: keys.filter(key => key !== k),
      isChange: true,
      canPreview: false,
      canCancel: true,
    });
  };

  add = () => {
    const { keys } = this.state;
    id += 1;
    const nextKeys = keys.concat(id);
    this.setState({ keys: nextKeys });
  };

  handleChange = () => {
    this.setState({
      isChange: true,
      canPreview: false,
      canCancel: true,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { isChange, canPreview, canCancel, keys } = this.state;
    getFieldDecorator('keys', { initialValue: keys });
    const formItems = keys.map((k, index) => (
      <Form.Item
        label={index === 0 ? `${formatMessage({ id: 'showroom.after-sales-service' })}` : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`afterSaleServiceList[${k}]`)(
          <Input
            placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            style={{ width: '60%', marginRight: 8 }}
            autoComplete='off'
            onChange={val => this.handleChange(val)}
            maxLength={500}
          />,
        )}
        {keys.length > 1 ? (
          <Icon
            className='dynamic-delete-button'
            type='minus-circle-o'
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label={formatMessage({ id: 'showroom.picVcr' })}>
              {getFieldDecorator('picVcrList', {
                getValueFromEvent: this.normFile,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'showroom.picVcr-required',
                    }),
                  },
                ],
              })(
                <UploadList
                  accpet='.png, .jpg, .jpeg, .mp4'
                  maxSize={{
                    'image/png': 1024,
                    'image/jpg': 1024,
                    'image/jpeg': 1024,
                    'video/mp4': 1024 * 10,
                  }}
                  maxLength={10}
                  listType='picture-card'
                  onOriginChange={file => this.onOriginChange(file)}
                />,
              )}
              <p className='uploadTips'>{formatMessage({ id: 'showroom.picVcr.tips' })}</p>
            </FormItem>
            <FormItem label={formatMessage({ id: 'showroom.certificatesRewards' })}>
              {getFieldDecorator('certRewardList', {
                getValueFromEvent: this.normFile,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'showroom.certificatesRewards-required',
                    }),
                  },
                ],
              })(
                <UploadList
                  accpet='.png, .jpg, .jpeg'
                  maxSize={1 * 1024}
                  maxLength={10}
                  listType='picture-card'
                  onOriginChange={file => this.onOriginChange(file)}
                />,
              )}
              <p className='uploadTips'>
                {formatMessage({ id: 'showroom.certificatesRewards.tips' })}
              </p>
            </FormItem>
            <FormItem label={formatMessage({ id: 'showroom.panoramaPic' })}>
              {getFieldDecorator('vrList', {
                getValueFromEvent: this.normFile,
              })(
                <UploadList
                  accpet='.hdr, .png, .jpg, .jpeg, .gif'
                  maxSize={50 * 1024}
                  maxLength={5}
                  listType='picture-card'
                  onOriginChange={file => this.onOriginChange(file)}
                />,
              )}
              <p className='uploadTips'>{formatMessage({ id: 'showroom.panoramaPic.tips' })}</p>
            </FormItem>
            {formItems}
            {keys.length < 10 && (
              <FormItem>
                <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
                  <Icon type='plus' />
                  {formatMessage({ id: 'yeeorder.Add' })}
                </Button>
              </FormItem>
            )}
            <FormItem>
              <Button type='primary' disabled={!canCancel} onClick={this.handleCancel}>
                {formatMessage({ id: 'yeeorder.Cancel' })}
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                disabled={!isChange}
                style={{ marginLeft: '20px' }}
              >
                {formatMessage({ id: 'yeeorder.Save' })}
              </Button>
              <Button
                type='primary'
                style={{ marginLeft: '20px' }}
                onClick={this.previewShowroom}
                disabled={!canPreview}
              >
                {formatMessage({ id: 'yeeorder.Preview' })}
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Showroom);
