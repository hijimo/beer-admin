import React, { Component } from 'react';
import { Input, Modal, Button, Typography, Form, Icon, Row, Col, message } from 'antd';
import clsx from 'classnames';
import cuid from 'cuid';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import { ModalType, formKeys } from '../config';
import styles from './index.less';

const TITLE = 'title';
const CONTENT = 'content';
const PIC = 'pic';
const LINK = 'link';

const BANNER_LINK_PREFIX = 'banner_link_';
const BANNER_PIC_PREFIX = 'banner_pic_';

const INTRO2_PIC_PREFIX = 'intro2_pic_';
const INTRO2_TITLE_PREFIX = 'intro2_title_';
const INTRO2_CONTENT_PREFIX = 'intro2_content_';

const INTRO3_PIC_PREFIX = 'intro3_pic_';
const INTRO3_LINK_PREFIX = 'intro3_link_';

const INTRO4_PIC_PREFIX = 'intro4_pic_';
const INTRO4_LINK_PREFIX = 'intro4_link_';

const MAX_BANNER = 5;
const MAX_INTRO2 = 4;
const MAX_INTRO3 = 4;
const MAX_INTRO4 = 10;
const MIN_INTRO4 = 4;

const MAX_PIC_LAN = 4;
const URL_REG = /^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
const MODAL_TITLE = {
  [ModalType.Banner]: 'website.banner.modal.title.banner',
  [ModalType.Introduction1]: 'website.banner.modal.title.introduction1',
  [ModalType.Introduction2]: 'website.banner.modal.title.introduction2',
  [ModalType.Introduction3]: 'website.banner.modal.title.introduction3',
  [ModalType.Introduction4]: 'website.banner.modal.title.introduction4',
  [ModalType.Introduction5]: 'website.banner.modal.title.introduction5',
};
class BannerModal extends Component {
  state = {
    bannerCount: 0,
    intro2Count: 0,
    intro4Count: 0,
  };

  componentDidUpdate(prevProps) {
    const { form } = prevProps;
    if (this.props.visiable && prevProps.visiable !== this.props.visiable) {
      form.resetFields();
      if (this.props.modalType === ModalType.Banner) {
        this.initialBannerModalTypeData();
      }
      if (this.props.modalType === ModalType.Introduction1) {
        this.initializModalType1Data();
      }
      if (this.props.modalType === ModalType.Introduction2) {
        this.initializModalType2Data();
      }
      if (this.props.modalType === ModalType.Introduction3) {
        this.initializModalType3Data();
      }
      if (this.props.modalType === ModalType.Introduction4) {
        this.initializModalType4Data();
      }
      if (this.props.modalType === ModalType.Introduction5) {
        this.initializModalType5Data();
      }
    }
  }

  handleOk = () => {
    const { form, modalType } = this.props;
    form.validateFields((valid, values) => {
      if (valid) {
        return;
      }
      const data = {
        sortNo: 0,
        widgetProperty: {},
      };
      const { bannerCount, intro2Count, intro4Count } = this.state;
      if (modalType === ModalType.Banner) {
        Array.from({ length: bannerCount }, x => x).forEach((item, index) => {
          data.widgetProperty.pictures = (data.widgetProperty.pictures || []).concat({
            link: values[`${BANNER_LINK_PREFIX}${index}`],
            url: values[`${BANNER_PIC_PREFIX}${index}`][0].url,
          });
        });
        // for (let i = 0; i < bannerCount; i++) {
        //   data.widgetProperty.pictures = (data.widgetProperty.pictures || []).concat({
        //     link: values[`${BANNER_LINK_PREFIX}${i}`],
        //     url: values[`${BANNER_PIC_PREFIX}${i}`][0].url,
        //   });
        // }
        data.widgetCode = formKeys.banner;
      }
      if (modalType === ModalType.Introduction1) {
        // about us
        data.widgetProperty = {
          title: values[`${TITLE}`],
          content: values[`${CONTENT}`],
          picture: {
            url: values[`${PIC}`][0].url,
            link: values[`${LINK}`],
          },
        };
        data.widgetCode = formKeys.intro1;
      }
      if (modalType === ModalType.Introduction2) {
        // our advantage
        data.widgetProperty = {
          title: values[`${TITLE}`],
          content: values[`${CONTENT}`],
        };
        Array.from({ length: intro2Count }, x => x).forEach((item, index) => {
          data.widgetProperty.pictures = (data.widgetProperty.pictures || []).concat({
            url: values[`${INTRO2_PIC_PREFIX}${index}`][0].url,
            title: values[`${INTRO2_TITLE_PREFIX}${index}`],
            content: values[`${INTRO2_CONTENT_PREFIX}${index}`],
          });
        });
        // for (let i = 0; i < intro2Count; i++) {
        //   data.widgetProperty.pictures = (data.widgetProperty.pictures || []).concat({
        //     url: values[`${INTRO2_PIC_PREFIX}${i}`][0].url,
        //     title: values[`${INTRO2_TITLE_PREFIX}${i}`],
        //     content: values[`${INTRO2_CONTENT_PREFIX}${i}`],
        //   });
        // }
        data.widgetCode = formKeys.intro2;
      }
      if (modalType === ModalType.Introduction3) {
        data.widgetProperty = {
          title: values[`${TITLE}`],
          content: values[`${CONTENT}`],
        };
        Array.from({ length: MAX_INTRO3 }, x => x).forEach((item, index) => {
          data.widgetProperty.pictures = (data.widgetProperty.pictures || []).concat({
            url: values[`${INTRO3_PIC_PREFIX}${index}`][0].url,
            link: values[`${INTRO3_LINK_PREFIX}${index}`],
          });
        });
        // for (let i = 0; i < MAX_INTRO3; i++) {
        //   data.widgetProperty.pictures = (data.widgetProperty.pictures || []).concat({
        //     url: values[`${INTRO3_PIC_PREFIX}${i}`][0].url,
        //     link: values[`${INTRO3_LINK_PREFIX}${i}`],
        //   });
        // }

        data.widgetCode = formKeys.intro3;
      }
      if (modalType === ModalType.Introduction4) {
        if (intro4Count < MIN_INTRO4) {
          message.error('At least four items');
          return;
        }
        data.widgetProperty = {
          title: values[`${TITLE}`],
        };
        Array.from({ length: intro4Count }, x => x).forEach((item, index) => {
          data.widgetProperty.pictures = (data.widgetProperty.pictures || []).concat({
            url: values[`${INTRO4_PIC_PREFIX}${index}`][0].url,
            link: values[`${INTRO4_LINK_PREFIX}${index}`],
          });
        });
        // for (let i = 0; i < intro4Count; i++) {
        //   data.widgetProperty.pictures = (data.widgetProperty.pictures || []).concat({
        //     url: values[`${INTRO4_PIC_PREFIX}${i}`][0].url,
        //     link: values[`${INTRO4_LINK_PREFIX}${i}`],
        //   });
        // }
        data.widgetCode = formKeys.intro4;
      }
      if (modalType === ModalType.Introduction5) {
        // organization
        data.widgetProperty = {
          title: values[`${TITLE}`],
          pictures: values[`${PIC}`].map(t => ({
            url: t.url,
          })),
        };

        data.widgetCode = formKeys.intro5;
      }
      this.props.handleOk(data);
    });
  };

  handleItemRemove = index => {
    const { modalType, form } = this.props;
    const { bannerCount, intro2Count, intro4Count } = this.state;
    if (modalType === ModalType.Banner && bannerCount !== 1) {
      if (bannerCount === index + 1) {
        this.setState(prevs => ({
          bannerCount: prevs.bannerCount - 1,
        }));
      } else {
        const data = form.getFieldsValue();
        const links = [];
        const pics = [];
        Array.from({ length: bannerCount }, x => x).forEach((item, index1) => {
          links.push(data[`${BANNER_LINK_PREFIX}${index1}`]);
          pics.push(data[`${BANNER_PIC_PREFIX}${index1}`]);
        });
        // for (let i = index + 1; i < bannerCount; i++) {
        //   links.push(data[`${BANNER_LINK_PREFIX}${i}`]);
        //   pics.push(data[`${BANNER_PIC_PREFIX}${i}`]);
        // }
        this.setState(
          prevs => ({
            bannerCount: prevs.bannerCount - 1,
          }),
          () => {
            for (let i = index; i < bannerCount - 1; i += 1) {
              form.setFieldsValue({
                [`${BANNER_LINK_PREFIX}${i}`]: links[i - index],
                [`${BANNER_PIC_PREFIX}${i}`]: pics[i - index],
              });
            }
          },
        );
      }
    }
    if (modalType === ModalType.Introduction2 && intro2Count !== 1) {
      if (intro2Count === index + 1) {
        this.setState(prevs => ({
          intro2Count: prevs.intro2Count - 1,
        }));
      } else {
        const data = form.getFieldsValue();
        const titles = [];
        const contents = [];
        const pics = [];
        for (let i = index + 1; i < intro2Count; i += 1) {
          pics.push(data[`${INTRO2_PIC_PREFIX}${i}`]);
          titles.push(data[`${INTRO2_TITLE_PREFIX}${i}`]);
          contents.push(data[`${INTRO2_CONTENT_PREFIX}${i}`]);
        }
        this.setState(
          prevs => ({
            intro2Count: prevs.intro2Count - 1,
          }),
          () => {
            for (let i = index; i < intro2Count - 1; i += 1) {
              form.setFieldsValue({
                [`${INTRO2_PIC_PREFIX}${i}`]: pics[i - index],
                [`${INTRO2_TITLE_PREFIX}${i}`]: titles[i - index],
                [`${INTRO2_CONTENT_PREFIX}${i}`]: contents[i - index],
              });
            }
          },
        );
      }
    }
    if (modalType === ModalType.Introduction4 && intro4Count !== 1) {
      if (intro4Count === index + 1) {
        this.setState(prevs => ({
          intro4Count: prevs.intro4Count - 1,
        }));
      } else {
        const data = form.getFieldsValue();
        const titles = [];
        const pics = [];

        for (let i = index + 1; i < intro4Count; i += 1) {
          pics.push(data[`${INTRO4_PIC_PREFIX}${i}`]);
          titles.push(data[`${INTRO4_LINK_PREFIX}${i}`]);
        }
        this.setState(
          prevs => ({
            intro4Count: prevs.intro4Count - 1,
          }),
          () => {
            for (let i = index; i < intro4Count - 1; i += 1) {
              form.setFieldsValue({
                [`${INTRO4_PIC_PREFIX}${i}`]: pics[i - index],
                [`${INTRO4_LINK_PREFIX}${i}`]: titles[i - index],
              });
            }
          },
        );
      }
    }
  };

  handleItemMoveUp = index => {
    const { modalType, form } = this.props;
    if (index) {
      if (modalType === ModalType.Banner) {
        const target = {
          link: form.getFieldValue(`${BANNER_LINK_PREFIX}${index - 1}`),
          pic: form.getFieldValue(`${BANNER_PIC_PREFIX}${index - 1}`),
        };
        const item = {
          link: form.getFieldValue(`${BANNER_LINK_PREFIX}${index}`),
          pic: form.getFieldValue(`${BANNER_PIC_PREFIX}${index}`),
        };
        form.setFieldsValue({
          [`${BANNER_LINK_PREFIX}${index - 1}`]: item.link,
          [`${BANNER_PIC_PREFIX}${index - 1}`]: item.pic,
          [`${BANNER_LINK_PREFIX}${index}`]: target.link,
          [`${BANNER_PIC_PREFIX}${index}`]: target.pic,
        });
      }
      if (modalType === ModalType.Introduction2) {
        const target = {
          title: form.getFieldValue(`${INTRO2_TITLE_PREFIX}${index - 1}`),
          pic: form.getFieldValue(`${INTRO2_PIC_PREFIX}${index - 1}`),
          content: form.getFieldValue(`${INTRO2_CONTENT_PREFIX}${index - 1}`),
        };
        const item = {
          title: form.getFieldValue(`${INTRO2_TITLE_PREFIX}${index}`),
          pic: form.getFieldValue(`${INTRO2_PIC_PREFIX}${index}`),
          content: form.getFieldValue(`${INTRO2_CONTENT_PREFIX}${index}`),
        };
        form.setFieldsValue({
          [`${INTRO2_TITLE_PREFIX}${index - 1}`]: item.title,
          [`${INTRO2_PIC_PREFIX}${index - 1}`]: item.pic,
          [`${INTRO2_CONTENT_PREFIX}${index - 1}`]: item.content,
          [`${INTRO2_TITLE_PREFIX}${index}`]: target.title,
          [`${INTRO2_PIC_PREFIX}${index}`]: target.pic,
          [`${INTRO2_CONTENT_PREFIX}${index}`]: target.content,
        });
      }
      if (modalType === ModalType.Introduction3) {
        const target = {
          link: form.getFieldValue(`${INTRO3_LINK_PREFIX}${index - 1}`),
          pic: form.getFieldValue(`${INTRO3_PIC_PREFIX}${index - 1}`),
        };
        const item = {
          link: form.getFieldValue(`${INTRO3_LINK_PREFIX}${index}`),
          pic: form.getFieldValue(`${INTRO3_PIC_PREFIX}${index}`),
        };
        form.setFieldsValue({
          [`${INTRO3_LINK_PREFIX}${index - 1}`]: item.link,
          [`${INTRO3_PIC_PREFIX}${index - 1}`]: item.pic,
          [`${INTRO3_LINK_PREFIX}${index}`]: target.link,
          [`${INTRO3_PIC_PREFIX}${index}`]: target.pic,
        });
      }
      if (modalType === ModalType.Introduction4) {
        const target = {
          link: form.getFieldValue(`${INTRO4_LINK_PREFIX}${index - 1}`),
          pic: form.getFieldValue(`${INTRO4_PIC_PREFIX}${index - 1}`),
        };
        const item = {
          link: form.getFieldValue(`${INTRO4_LINK_PREFIX}${index}`),
          pic: form.getFieldValue(`${INTRO4_PIC_PREFIX}${index}`),
        };
        form.setFieldsValue({
          [`${INTRO4_LINK_PREFIX}${index - 1}`]: item.link,
          [`${INTRO4_PIC_PREFIX}${index - 1}`]: item.pic,
          [`${INTRO4_LINK_PREFIX}${index}`]: target.link,
          [`${INTRO4_PIC_PREFIX}${index}`]: target.pic,
        });
      }
    }
  };

  handleAdd = () => {
    const { modalType } = this.props;
    if (modalType === ModalType.Banner && this.state.bannerCount < MAX_BANNER) {
      this.setState(prevs => ({
        bannerCount: prevs.bannerCount + 1,
      }));
    }
    if (modalType === ModalType.Introduction2) {
      this.setState(prevs => ({
        intro2Count: prevs.intro2Count + 1,
      }));
    }
    if (modalType === ModalType.Introduction4) {
      this.setState(prevs => ({
        intro4Count: prevs.intro4Count + 1,
      }));
    }
  };

  initializModalType1Data() {
    const { detail, form } = this.props;
    if (detail) {
      const data = detail.widgetProperty ? detail.widgetProperty : detail.epwPropertyView;
      form.setFieldsValue({
        [`${TITLE}`]: data.title,
        [`${CONTENT}`]: data.content,
        [`${LINK}`]: data.picture.link,
        [`${PIC}`]: [{ url: data.picture.url, uid: cuid() }],
      });
    }
  }

  initializModalType2Data() {
    const { detail, form } = this.props;
    if (!detail) {
      this.setState({ intro2Count: 1 });
    } else {
      const data = detail.widgetProperty ? detail.widgetProperty : detail.epwPropertyView;
      this.setState(
        {
          intro2Count: data.pictures.length,
        },
        () => {
          form.setFieldsValue({
            [`${TITLE}`]: data.title,
            [`${CONTENT}`]: data.content,
          });
          data.pictures.forEach((item, index) => {
            form.setFieldsValue({
              [`${INTRO2_PIC_PREFIX}${index}`]: [{ url: item.url, uid: cuid() }],
              [`${INTRO2_TITLE_PREFIX}${index}`]: item.title,
              [`${INTRO2_CONTENT_PREFIX}${index}`]: item.content,
            });
          });
        },
      );
    }
  }

  initializModalType3Data() {
    const { detail, form } = this.props;
    if (detail) {
      const data = detail.widgetProperty ? detail.widgetProperty : detail.epwPropertyView;
      form.setFieldsValue({
        [`${TITLE}`]: data.title,
        [`${CONTENT}`]: data.content,
      });
      data.pictures.forEach((item, index) => {
        form.setFieldsValue({
          [`${INTRO3_PIC_PREFIX}${index}`]: [{ url: item.url, uid: cuid() }],
          [`${INTRO3_LINK_PREFIX}${index}`]: item.link,
        });
      });
    }
  }

  initializModalType4Data() {
    const { detail, form } = this.props;
    if (!detail) {
      this.setState({ intro4Count: 1 });
    } else {
      const data = detail.widgetProperty ? detail.widgetProperty : detail.epwPropertyView;
      this.setState(
        {
          intro4Count: data.pictures.length,
        },
        () => {
          form.setFieldsValue({
            [`${TITLE}`]: data.title,
          });
          data.pictures.forEach((item, index) => {
            form.setFieldsValue({
              [`${INTRO4_PIC_PREFIX}${index}`]: [{ url: item.url, uid: cuid() }],
              [`${INTRO4_LINK_PREFIX}${index}`]: item.link,
            });
          });
        },
      );
    }
  }

  initializModalType5Data() {
    const { detail, form } = this.props;
    if (detail) {
      const data = detail.widgetProperty ? detail.widgetProperty : detail.epwPropertyView;
      form.setFieldsValue({
        [`${TITLE}`]: data.title,
        [`${PIC}`]: data.pictures.map(t => ({
          url: t.url,
          uid: cuid(),
        })),
      });
    }
  }

  initialBannerModalTypeData() {
    const { detail, form } = this.props;
    if (!detail) {
      this.setState({ bannerCount: 1 });
    } else {
      const data = detail.widgetProperty ? detail.widgetProperty : detail.epwPropertyView;
      this.setState(
        {
          bannerCount: data.pictures.length,
        },
        () => {
          data.pictures.forEach((item, index) => {
            form.setFieldsValue({
              [`${BANNER_PIC_PREFIX}${index}`]: [{ url: item.url, uid: cuid() }],
              [`${BANNER_LINK_PREFIX}${index}`]: item.link,
            });
          });
        },
      );
    }
  }

  renderTitle() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Col span={24}>
        <Form.Item label={formatMessage({ id: 'website.banner.modal.form.title' })} required>
          {getFieldDecorator(TITLE, {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'website.banner.modal.form.title.msg.required' }),
              },
            ],
          })(
            <Input
              autoComplete='off'
              placeholder={formatMessage({ id: 'yeeorder.please-input' })}
            />,
          )}
        </Form.Item>
      </Col>
    );
  }

  renderContent() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Col span={24}>
          <Form.Item label={formatMessage({ id: 'website.banner.modal.form.content' })}>
            {getFieldDecorator(CONTENT, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'website.banner.modal.form.content.msg.required' }),
                },
              ],
            })(
              <Input.TextArea
                rows={3}
                placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                maxLength={400}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
    );
  }

  renderUrlLink() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Col span={24}>
          <Form.Item label={formatMessage({ id: 'website.banner.modal.form.urlLink' })}>
            {getFieldDecorator(LINK, {
              rules: [
                {
                  pattern: URL_REG,
                  message: formatMessage({ id: 'website.banner.modal.form.urlLink.msg.invalid' }),
                },
              ],
            })(
              <Input
                autoComplete='off'
                placeholder={formatMessage({ id: 'website.banner.modal.form.urlLink.placeholder' })}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
    );
  }

  renderIntroduction2Row() {
    const { intro2Count } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        {new Array(intro2Count).fill(0).map((item, index) => (
          <Row
            className={clsx(styles.picRow, index === MAX_PIC_LAN - 1 ? styles.lastPicRow : '')}
            key={index}
            gutter={16}
          >
            <Col span={4}>
              <Form.Item required>
                {getFieldDecorator(`${INTRO2_PIC_PREFIX}${index}`, {
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'website.banner.modal.form.picture.msg.required',
                      }),
                    },
                  ],
                })(
                  <UploadList
                    accpet='.jpg,.jpeg,.png'
                    maxLength={1}
                    maxSize={2048}
                    listType='picture-card'
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator(`${INTRO2_TITLE_PREFIX}${index}`, {})(
                  <Input
                    autoComplete='off'
                    placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator(`${INTRO2_CONTENT_PREFIX}${index}`, {})(
                  <Input
                    autoComplete='off'
                    placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={4} className={styles.action}>
              <Icon
                type='close'
                className={intro2Count === 1 ? styles.iconDisabled : ''}
                onClick={() => this.handleItemRemove(index)}
              />
              <Icon
                type='arrow-up'
                className={!index ? styles.iconDisabled : ''}
                onClick={() => this.handleItemMoveUp(index)}
              />
            </Col>
          </Row>
        ))}
        {intro2Count < MAX_INTRO2 && (
          <Button
            style={{
              width: '100%',
              marginTop: 16,
              marginBottom: 8,
            }}
            type='dashed'
            onClick={this.handleAdd}
            icon='plus'
          >
            <FormattedMessage id='yeeorder.Add' />
          </Button>
        )}
      </React.Fragment>
    );
  }

  renderIntroduction2RowHead = () => (
    <Row gutter={16} className={styles.headerRow}>
      <Col span={4}>
        <div className={styles.modalTableHeader}>
          <FormattedMessage id='website.banner.modal.form.picture' />{' '}
          <span style={{ color: 'red' }}>*</span>
        </div>
      </Col>
      <Col span={8}>
        <div className={styles.modalTableHeader}>
          <FormattedMessage id='website.banner.modal.form.title' />
        </div>
      </Col>
      <Col span={8}>
        <div className={styles.modalTableHeader}>
          <FormattedMessage id='website.banner.modal.form.content' />
        </div>
      </Col>
      <Col span={4}>
        <div className={styles.modalTableHeader}>
          <FormattedMessage id='yeeorder.action' />
        </div>
      </Col>
    </Row>
  );

  renderIntroduction3RowHead = () => (
    <Row gutter={16} className={styles.headerRow}>
      <Col span={4}>
        <div className={styles.modalTableHeader}>
          <FormattedMessage id='website.banner.modal.form.picture' />{' '}
          <span style={{ color: 'red' }}>*</span>
        </div>
      </Col>
      <Col span={16}>
        <div className={styles.modalTableHeader}>
          <FormattedMessage id='website.banner.modal.form.urlLink' />
        </div>
      </Col>
      <Col span={4}>
        <div className={styles.modalTableHeader}>
          <FormattedMessage id='website.banner.modal.action' />
        </div>
      </Col>
    </Row>
  );

  renderIntroduction3Row() {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        {new Array(MAX_INTRO3).fill(0).map((item, index) => (
          <Row
            className={clsx(styles.picRow, index === MAX_PIC_LAN - 1 ? styles.lastPicRow : '')}
            key={index}
            gutter={16}
          >
            <Col span={4}>
              <Form.Item>
                {getFieldDecorator(`${INTRO3_PIC_PREFIX}${index}`, {
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'website.banner.modal.form.picture.msg.required',
                      }),
                    },
                  ],
                })(
                  <UploadList
                    accpet='.jpg,.jpeg,.png'
                    maxLength={1}
                    maxSize={2048}
                    listType='picture-card'
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item>
                {getFieldDecorator(`${INTRO3_LINK_PREFIX}${index}`, {
                  rules: [
                    {
                      pattern: URL_REG,
                      message: formatMessage({
                        id: 'website.banner.modal.form.urlLink.msg.invalid',
                      }),
                    },
                  ],
                })(
                  <Input
                    autoComplete='off'
                    placeholder={formatMessage({
                      id: 'website.banner.modal.form.urlLink.placeholder',
                    })}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={4} className={styles.action}>
              <Icon
                type='arrow-up'
                className={!index ? styles.iconDisabled : ''}
                onClick={() => this.handleItemMoveUp(index)}
              />
            </Col>
          </Row>
        ))}
      </React.Fragment>
    );
  }

  renderIntroduction4Row(item, index) {
    const { intro4Count } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Row className={styles.picRow} key={index} gutter={16}>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator(`${INTRO4_PIC_PREFIX}${index}`, {
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'website.banner.modal.form.picture.msg.required',
                    }),
                  },
                ],
              })(
                <UploadList
                  accpet='.jpg,.jpeg,.png'
                  maxLength={1}
                  maxSize={2048}
                  listType='picture-card'
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item>
              {getFieldDecorator(`${INTRO4_LINK_PREFIX}${index}`, {
                rules: [
                  {
                    pattern: URL_REG,
                    message: formatMessage({
                      id: 'website.banner.modal.form.urlLink.msg.invalid',
                    }),
                  },
                ],
              })(
                <Input
                  autoComplete='off'
                  placeholder={formatMessage({
                    id: 'website.banner.modal.form.urlLink.placeholder',
                  })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={4} className={styles.action}>
            <Icon
              type='close'
              className={intro4Count === 1 ? styles.iconDisabled : ''}
              onClick={() => this.handleItemRemove(index)}
            />
            <Icon
              type='arrow-up'
              className={!index ? styles.iconDisabled : ''}
              onClick={() => this.handleItemMoveUp(index)}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  renderFileList() {
    const { modalType } = this.props;
    const max = modalType === ModalType.Introduction5 ? undefined : 1;
    const { getFieldDecorator } = this.props.form;
    return (
      <Row className={styles.introduction5Row}>
        <Col span={24}>
          <Form.Item label={formatMessage({ id: 'website.banner.modal.form.picture' })}>
            <p>
              <Typography.Text style={{ fontSize: '80%' }}>
                {formatMessage({ id: 'website.banner.modal.form.picture.tip' })}
              </Typography.Text>
            </p>
            {getFieldDecorator(PIC, {
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'website.banner.modal.form.picture.msg.required',
                  }),
                },
              ],
            })(
              <UploadList
                accpet='.jpg, .jpeg, .png'
                maxLength={max}
                maxSize={500}
                listType='picture-card'
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
    );
  }

  renderIntro1() {
    return (
      <React.Fragment>
        <Row className={styles.row}>{this.renderTitle()}</Row>
        {this.renderContent()}
        {this.renderFileList()}
        {this.renderUrlLink()}
      </React.Fragment>
    );
  }

  renderIntro2() {
    return (
      <React.Fragment>
        <Row className={styles.row}>{this.renderTitle()}</Row>
        {this.renderContent()}
        {this.renderIntroduction2RowHead()}
        {this.renderIntroduction2Row()}
      </React.Fragment>
    );
  }

  renderIntro3() {
    return (
      <React.Fragment>
        <Row className={styles.row}>{this.renderTitle()}</Row>
        {this.renderContent()}
        {this.renderIntroduction3RowHead()}
        {this.renderIntroduction3Row()}
      </React.Fragment>
    );
  }

  renderIntro4() {
    const { intro4Count } = this.state;
    return (
      <React.Fragment>
        <Row className={styles.row}>{this.renderTitle()}</Row>
        <React.Fragment>
          <Row gutter={16} className={styles.headerRow}>
            <Col span={4}>
              <div className={styles.modalTableHeader}>
                <FormattedMessage id='website.banner.modal.form.picture' />
                <span style={{ color: 'red' }}>*</span>
              </div>
            </Col>
            <Col span={16}>
              <div className={styles.modalTableHeader}>
                <FormattedMessage id='website.banner.modal.form.urlLink' />
              </div>
            </Col>
            <Col span={4}>
              <div className={styles.modalTableHeader}>
                <FormattedMessage id='website.banner.modal.action' />
              </div>
            </Col>
          </Row>
          <Form layout='inline'>
            {new Array(intro4Count).fill(0).map((item, i) => this.renderIntroduction4Row(item, i))}
            {intro4Count < MAX_INTRO4 && (
              <Button
                style={{
                  width: '100%',
                  marginTop: 16,
                  marginBottom: 8,
                }}
                type='dashed'
                onClick={this.handleAdd}
                icon='plus'
              >
                <FormattedMessage id='yeeorder.Add' />
              </Button>
            )}
          </Form>
        </React.Fragment>
      </React.Fragment>
    );
  }

  renderIntro5() {
    return (
      <React.Fragment>
        <Row className={styles.row}>{this.renderTitle()}</Row>
        {this.renderFileList()}
      </React.Fragment>
    );
  }

  renderForm() {
    const { modalType } = this.props;
    return (
      <Form layout='vertical'>
        {modalType === ModalType.Introduction1 && this.renderIntro1()}
        {modalType === ModalType.Introduction2 && this.renderIntro2()}
        {modalType === ModalType.Introduction3 && this.renderIntro3()}
        {modalType === ModalType.Introduction4 && this.renderIntro4()}
        {modalType === ModalType.Introduction5 && this.renderIntro5()}
      </Form>
    );
  }

  renderBannerRow(item, index) {
    const { getFieldDecorator } = this.props.form;
    const { bannerCount } = this.state;
    return (
      <Row className={styles.picRow} key={index} gutter={16}>
        <Col span={4} className={styles.uploadList}>
          <Form.Item>
            {getFieldDecorator(`${BANNER_PIC_PREFIX}${index}`, {
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'website.banner.modal.form.picture.msg.required',
                  }),
                },
              ],
            })(
              <UploadList
                accpet='.jpg, .jpeg, .png'
                maxLength={1}
                maxSize={1024}
                listType='picture-card'
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item>
            {getFieldDecorator(`${BANNER_LINK_PREFIX}${index}`, {
              rules: [
                {
                  pattern: URL_REG,
                  message: formatMessage({ id: 'website.banner.modal.form.urlLink.msg.invalid' }),
                },
              ],
            })(
              <Input
                autoComplete='off'
                placeholder={formatMessage({ id: 'website.banner.modal.form.urlLink.placeholder' })}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={4} className={styles.action}>
          <Icon
            type='close'
            className={bannerCount === 1 ? styles.iconDisabled : ''}
            onClick={() => this.handleItemRemove(index)}
          />
          <Icon
            type='arrow-up'
            className={!index ? styles.iconDisabled : ''}
            onClick={() => this.handleItemMoveUp(index)}
          />
        </Col>
      </Row>
    );
  }

  renderBannerForm() {
    const { bannerCount } = this.state;
    return (
      <React.Fragment>
        <p className={styles.picTip}>
          <FormattedMessage id='website.banner.modal.banner.5.picTip' />
        </p>
        <Row gutter={16} className={styles.headerRow}>
          <Col span={4}>
            <div className={styles.modalTableHeader}>
              <FormattedMessage id='website.banner.modal.form.picture' />
              <span style={{ color: 'red' }}>*</span>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.modalTableHeader}>
              <FormattedMessage id='website.banner.modal.form.urlLink' />
            </div>
          </Col>
          <Col span={4}>
            <div className={styles.modalTableHeader}>
              <FormattedMessage id='website.banner.modal.action' />
            </div>
          </Col>
        </Row>
        <Form layout='inline'>
          {new Array(bannerCount).fill(0).map((item, i) => this.renderBannerRow(item, i))}
          {bannerCount < MAX_BANNER && (
            <Button
              style={{
                width: '100%',
                marginTop: 16,
                marginBottom: 8,
              }}
              type='dashed'
              onClick={this.handleAdd}
              icon='plus'
            >
              <FormattedMessage id='yeeorder.Add' />
            </Button>
          )}
        </Form>
      </React.Fragment>
    );
  }

  render() {
    const { modalType, visiable, handleCancel } = this.props;
    return (
      <Modal
        maskClosable
        title={<FormattedMessage id={MODAL_TITLE[modalType]} />}
        className={styles.root}
        width={800}
        visible={visiable}
        onCancel={handleCancel}
        onOk={this.handleOk}
      >
        {modalType === ModalType.Banner ? this.renderBannerForm() : this.renderForm()}
      </Modal>
    );
  }
}

export default Form.create()(BannerModal);
