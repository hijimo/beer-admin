import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Typography, Icon, message, Row, Col, Modal } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import clsx from 'classnames';
import _get from 'lodash/get';
import config from '@common/config';
import { websiteSave, websiteSubmit } from '@/services/website';
import { ModalType, formKeys } from './config';
import styles from './index.less';
import banner1 from './assets/banner1.png';
import banner2 from './assets/banner2.png';
import banner3 from './assets/banner3.png';
import banner41 from './assets/sec4_1.png';
import banner42 from './assets/sec4_2.png';
import banner43 from './assets/sec4_3.png';
import banner44 from './assets/sec4_4.png';
import introduction4 from './assets/introduction4.png';
import introduction5 from './assets/introduction5.png';
import BannerModal from './components/BannerModal';
import ButtomBtn from './components/ButtomBtn';
import AuditStatus from './components/AuditStatus';
import pic29 from './assets/29.png';
import pic30 from './assets/30.png';
import pic31 from './assets/31.png';
import pic32 from './assets/32.png';
import picNextArrorw from './assets/arrow-demo.png';

// const DRAFT = 0;
// const SUCCESS = 1;
// const FAIL = 2;
const AUDITING = 3;
const pageType = 3; // 供应商
const { mallHost } = config;

@connect(({ website, user }) => ({
  userInfo: user.currentUser,
  detail: website.detail,
  websiteInfo: website.websiteInfo,
  stagedFormData: website.stagedFormData,
  // displayInfo: website.displayInfo,
}))
class WebsiteManagemnet extends Component {
  static handleDisplayChange(checked, e) {
    e.stopPropagation();
    return false;
    // const { newDisplayInfo: obj } = this.state;
    // obj[str] = checked;
    // this.setState(
    //   {
    //     newDisplayInfo: obj,
    //   },
    //   () => {
    //     this.judgeDisplayChange();
    //   },
    // );
  }

  modalDetail;

  constructor(props) {
    super(props);
    this.state = {
      isDataChange: false,
      modalVisible: false,
      modalType: ModalType.Banner,
      // newDisplayInfo: {},
      isDisplayChange: false,
    };
    this.modalDetail = null;
  }

  componentDidMount() {
    this.fetchInfoMethod();
    this.fetchDetailMethod();
  }

  fetchInfoMethod = () => {
    const {
      dispatch,
      userInfo: { companyNo },
    } = this.props;
    dispatch({
      type: 'website/fetchInfo',
      payload: {
        pageFromNo: companyNo,
        pageType,
      },
    });
  };

  // setDisplayInnfo = () => {
  //   const { displayInfo } = this.props;
  //   const newDisplayInfo = {};
  //   for (const [key, value] of Object.entries(displayInfo)) {
  //     newDisplayInfo[key] = value;
  //   }
  //   this.setState({ newDisplayInfo });
  // };

  judgeDisplayChange = () => {
    const { displayInfo } = this.props;
    const { newDisplayInfo } = this.state;
    let isDisplayChange = false;
    for (const [key, value] of Object.entries(displayInfo)) {
      if (value !== newDisplayInfo[key]) {
        isDisplayChange = true;
        break;
      }
    }
    this.setState({ isDisplayChange });
  };

  handleModalVisible = sec => {
    const auditStatus = _get(this.props, 'websiteInfo.pageAudit', 0);
    if (auditStatus === AUDITING) {
      return;
    }
    const detail = this.props.detail || [];
    const staged = this.props.stagedFormData || [];
    let modalType = ModalType.Banner;
    switch (sec) {
      case ModalType.Banner:
        this.modalDetail =
          staged.find(t => t.widgetCode === formKeys.banner) ||
          detail.find(t => t.epwWidgetCode === formKeys.banner); // new
        modalType = ModalType.Banner;
        break;
      case ModalType.Introduction1:
        this.modalDetail =
          staged.find(t => t.widgetCode === formKeys.intro1) ||
          detail.find(t => t.epwWidgetCode === formKeys.intro1);
        modalType = ModalType.Introduction1;
        break;
      case ModalType.Introduction2:
        this.modalDetail =
          staged.find(t => t.widgetCode === formKeys.intro2) ||
          detail.find(t => t.epwWidgetCode === formKeys.intro2);
        modalType = ModalType.Introduction2;
        break;
      case ModalType.Introduction3:
        this.modalDetail =
          staged.find(t => t.widgetCode === formKeys.intro3) ||
          detail.find(t => t.epwWidgetCode === formKeys.intro3);
        modalType = ModalType.Introduction3;
        break;
      case ModalType.Introduction4:
        this.modalDetail =
          staged.find(t => t.widgetCode === formKeys.intro4) ||
          detail.find(t => t.epwWidgetCode === formKeys.intro4);
        modalType = ModalType.Introduction4;
        break;
      case ModalType.Introduction5:
        this.modalDetail =
          staged.find(t => t.widgetCode === formKeys.intro5) ||
          detail.find(t => t.epwWidgetCode === formKeys.intro5);
        modalType = ModalType.Introduction5;
        break;
      default:
        break;
    }
    this.setState({ modalVisible: true, modalType });
  };

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  handleOk = data => {
    const { modalType } = this.state;
    const { dispatch } = this.props;
    const detail = this.props.stagedFormData || [];
    const banner = detail.findIndex(t => t.widgetCode === formKeys.banner);
    const intro1 = detail.findIndex(t => t.widgetCode === formKeys.intro1);
    const intro2 = detail.findIndex(t => t.widgetCode === formKeys.intro2);
    const intro3 = detail.findIndex(t => t.widgetCode === formKeys.intro3);
    const intro4 = detail.findIndex(t => t.widgetCode === formKeys.intro4);
    const intro5 = detail.findIndex(t => t.widgetCode === formKeys.intro5);
    let index = -1;
    switch (modalType) {
      case ModalType.Banner:
        index = banner;
        break;
      case ModalType.Introduction1:
        index = intro1;
        break;
      case ModalType.Introduction2:
        index = intro2;
        break;
      case ModalType.Introduction3:
        index = intro3;
        break;
      case ModalType.Introduction4:
        index = intro4;
        break;
      case ModalType.Introduction5:
        index = intro5;
        break;
      default:
        break;
    }
    let payload = [];
    if (index === -1) {
      payload = [...detail, data];
    } else {
      detail.splice(index, 1, data);
      payload = [...detail];
    }
    if (payload) {
      dispatch({
        type: 'website/initStage',
        payload,
      });
    }
    this.setState({ isDataChange: true });
    this.handleModalClose();
  };

  handleSubmit = () => {
    const that = this;
    Modal.confirm({
      title: `${formatMessage({ id: 'yeeorder.Submit' })}`,
      content: `${formatMessage({ id: 'website.submit.warn' })}`,
      okText: `${formatMessage({ id: 'yeeorder.Confirm' })}`,
      cancelText: `${formatMessage({ id: 'yeeorder.Cancel' })}`,
      onOk() {
        that.submitMethod();
      },
    });
  };

  submitMethod = () => {
    const { websiteInfo, dispatch } = this.props;
    websiteSubmit({ id: websiteInfo.id }).then(res => {
      if (res.success) {
        message.success(formatMessage({ id: 'yeeorder.success' }));
        this.fetchDetailMethod();
        this.fetchInfoMethod();
        dispatch({
          type: 'website/initStage',
          payload: [],
        });
      }
    });
  };

  handleSave = async () => {
    const { websiteInfo, dispatch } = this.props;
    const property = await this.getProperty();
    websiteSave({
      pageId: websiteInfo.id,
      pageType,
      property,
    }).then(res => {
      if (res.success) {
        message.success(formatMessage({ id: 'yeeorder.success' }));
        this.setState({
          isDataChange: false,
          isDisplayChange: false,
        });
        this.fetchDetailMethod();
        this.fetchInfoMethod();
        dispatch({
          type: 'website/initStage',
          payload: [],
        });
      }
    });
  };

  handlePreview = () => {
    const {
      userInfo: { companyNo },
    } = this.props;
    window.open(`${mallHost}/companies/${companyNo}/home?type=preview`, '_blank');
  };

  getProperty = () => {
    const { stagedFormData = [], detail = [] } = this.props;
    // const { newDisplayInfo } = this.state;
    let property = [];
    if (!detail.length) {
      property = [...stagedFormData];
    } else {
      property = [...stagedFormData];
      detail.forEach(item => {
        const { epwWidgetCode, epwPropertyView } = item;
        const newItem = stagedFormData.find(t => t.widgetCode === epwWidgetCode);
        if (!newItem) {
          property.push({
            widgetCode: epwWidgetCode,
            widgetProperty: epwPropertyView,
          });
        }
      });
    }
    return property;
    // return property.map(item =>
    //   Object.assign({}, item, {
    //     display: newDisplayInfo[item.widgetCode],
    //   }),
    // );
  };

  handleModalShow = () => {
    this.setState({ modalVisible: true });
  };

  fetchDetailMethod() {
    const {
      dispatch,
      userInfo: { companyNo },
    } = this.props;
    dispatch({
      type: 'website/fetchDetail',
      payload: {
        pageFromNo: companyNo,
        pageType,
      },
    });
  }

  render() {
    const { modalVisible, modalType, isDataChange, isDisplayChange } = this.state;
    const { websiteInfo, detail } = this.props;
    const auditStatus = _get(this.props, 'websiteInfo.pageAudit', 0);
    const buttomBtnProps = {
      websiteInfo,
      isDataChange,
      isDisplayChange,
      detail,
      handleSave: this.handleSave,
      handleSubmit: this.handleSubmit,
      handlePreview: this.handlePreview,
    };
    const Banner = () => (
      <section className={clsx(styles.section, styles.textCenter)}>
        <a
          className={auditStatus !== AUDITING ? styles.sectionTrigger : ''}
          onClick={() => this.handleModalVisible(ModalType.Banner)}
        >
          <div className={styles.bannerContentRow}>
            <Typography.Title level={1}>
              <FormattedMessage id='website.banner1.title' />
            </Typography.Title>
            <Typography.Title level={4}>
              <FormattedMessage id='website.banner1.subtitle' />
            </Typography.Title>
          </div>
          <img className={styles.banner} src={banner1} alt='' />
          <div className={styles.coverWrapper}>
            <div>
              <Typography.Title level={2} className={styles.title}>
                <FormattedMessage id='website.banner.edit.banner' />
              </Typography.Title>
              <Icon className={styles.icon} type='edit' />
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner.edit.tip' />
              </Typography.Title>
            </div>
            {/* <div className={styles.switch}>
              <Switch
                size='small'
                style={{ width: 35 }}
                defaultChecked={display}
                onChange={(checked, e) => this.handleDisplayChange(checked, e, formKeys.banner)}
              />
              <Typography.Text>
                <FormattedMessage id='website.banner.display.tip' />
              </Typography.Text>
            </div> */}
          </div>
        </a>
      </section>
    );
    const Introduction1 = () => (
      <section className={styles.section}>
        <a
          className={auditStatus !== AUDITING ? styles.sectionTrigger : ''}
          onClick={() => this.handleModalVisible(ModalType.Introduction1)}
        >
          <Row type='flex' align='middle' gutter={15}>
            <Col span={12}>
              <img className={styles.banner} src={banner2} alt='' />
            </Col>
            <Col offset={1} span={8}>
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner2.title' />
              </Typography.Title>
              <p className={styles.text}>
                <FormattedMessage id='website.banner2.content' />
              </p>
            </Col>
          </Row>
          <div className={styles.coverWrapper}>
            <div>
              <Typography.Title level={2} className={styles.title}>
                <FormattedMessage id='website.banner.edit.introduction1' />
              </Typography.Title>
              <Icon className={styles.icon} type='edit' />
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner.edit.tip' />
              </Typography.Title>
            </div>
            {/* <div className={styles.switch}>
              <Switch
                size='small'
                style={{ width: 35 }}
                defaultChecked={display}
                onChange={(checked, e) => this.handleDisplayChange(checked, e, formKeys.intro1)}
              />
              <Typography.Text>
                <FormattedMessage id='website.banner.display.tip' />
              </Typography.Text>
            </div> */}
          </div>
        </a>
      </section>
    );
    const Introduction2 = () => (
      <section className={clsx(styles.section, styles.textCenter)}>
        <a
          className={auditStatus !== AUDITING ? styles.sectionTrigger : ''}
          onClick={() => this.handleModalVisible(ModalType.Introduction2)}
        >
          <div className={styles.section3ContentRow}>
            <Row type='flex' align='middle'>
              <Col span={24}>
                <Typography.Title level={4}>
                  <FormattedMessage id='website.banner3.title' />
                </Typography.Title>
                <p>
                  <FormattedMessage id='website.banner3.content' />
                </p>
              </Col>
            </Row>
            <div className={styles.iconItemsWrap}>
              <Row>
                <Col span={6}>
                  <img className={styles.iconItem} src={pic29} alt='' />
                  <Typography.Title level={4}>
                    <FormattedMessage id='website.banner3.icon1.text' />
                  </Typography.Title>
                </Col>
                <Col span={6}>
                  <img className={styles.iconItem} src={pic30} alt='' />
                  <Typography.Title level={4}>
                    <FormattedMessage id='website.banner3.icon2.text' />
                  </Typography.Title>
                </Col>
                <Col span={6}>
                  <img className={styles.iconItem} src={pic31} alt='' />
                  <Typography.Title level={4}>
                    <FormattedMessage id='website.banner3.icon3.text' />
                  </Typography.Title>
                </Col>
                <Col span={6}>
                  <img className={styles.iconItem} src={pic32} alt='' />
                  <Typography.Title level={4}>
                    <FormattedMessage id='website.banner3.icon4.text' />
                  </Typography.Title>
                </Col>
              </Row>
            </div>
          </div>

          <Row>
            <Col span={24}>
              <img className={styles.banner} src={banner3} alt='' />
            </Col>
          </Row>
          <div className={styles.coverWrapper}>
            <div>
              <Typography.Title level={2} className={styles.title}>
                <FormattedMessage id='website.banner.edit.introduction2' />
              </Typography.Title>
              <Icon className={styles.icon} type='edit' />
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner.edit.tip' />
              </Typography.Title>
            </div>
            {/* <div className={styles.switch}>
              <Switch
                size='small'
                style={{ width: 35 }}
                defaultChecked={display}
                onChange={(checked, e) => this.handleDisplayChange(checked, e, formKeys.intro2)}
              />
              <Typography.Text>
                <FormattedMessage id='website.banner.display.tip' />
              </Typography.Text>
            </div> */}
          </div>
        </a>
      </section>
    );
    const Introduction3 = () => (
      <section className={styles.section}>
        <a
          className={auditStatus !== AUDITING ? styles.sectionTrigger : ''}
          onClick={() => this.handleModalVisible(ModalType.Introduction3)}
        >
          <Row type='flex' align='middle' gutter={15}>
            <Col offset={1} span={8}>
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner4.title' />
              </Typography.Title>
              <p className={styles.text}>
                <FormattedMessage id='website.banner4.content' />
              </p>
            </Col>
            <Col offset={1} span={14}>
              <Row>
                <Col span={12}>
                  <img className={styles.banner} src={banner41} alt='' />
                </Col>
                <Col span={12}>
                  <img className={styles.banner} src={banner42} alt='' />
                </Col>
                <Col span={12}>
                  <img className={styles.banner} src={banner43} alt='' />
                </Col>
                <Col span={12}>
                  <img className={styles.banner} src={banner44} alt='' />
                </Col>
              </Row>
            </Col>
          </Row>
          <div className={styles.coverWrapper}>
            <div>
              <Typography.Title level={2} className={styles.title}>
                <FormattedMessage id='website.banner.edit.introduction3' />
              </Typography.Title>
              <Icon className={styles.icon} type='edit' />
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner.edit.tip' />
              </Typography.Title>
            </div>
            {/* <div className={styles.switch}>
              <Switch
                size='small'
                style={{ width: 35 }}
                defaultChecked={display}
                onChange={(checked, e) => this.handleDisplayChange(checked, e, formKeys.intro3)}
              />
              <Typography.Text>
                <FormattedMessage id='website.banner.display.tip' />
              </Typography.Text>
            </div> */}
          </div>
        </a>
      </section>
    );
    const Introduction4 = () => (
      <section className={clsx(styles.section, styles.textCenter)}>
        <a
          className={auditStatus !== AUDITING ? styles.sectionTrigger : ''}
          onClick={() => this.handleModalVisible(ModalType.Introduction4)}
        >
          <Row type='flex' align='middle'>
            <Col span={24}>
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner5.title' />
              </Typography.Title>
            </Col>
            <Col span={24}>
              <img className={styles.banner} src={introduction4} alt='' />
            </Col>
          </Row>
          <img src={picNextArrorw} style={{ marginTop: 16 }} alt='' />
          <div className={styles.coverWrapper}>
            <div>
              <Typography.Title level={2} className={styles.title}>
                <FormattedMessage id='website.banner.edit.introduction4' />
              </Typography.Title>
              <Icon className={styles.icon} type='edit' />
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner.edit.tip' />
              </Typography.Title>
            </div>
            {/* <div className={styles.switch}>
              <Switch
                size='small'
                style={{ width: 35 }}
                defaultChecked={display}
                onChange={(checked, e) => this.handleDisplayChange(checked, e, formKeys.intro4)}
              />
              <Typography.Text>
                <FormattedMessage id='website.banner.display.tip' />
              </Typography.Text>
            </div> */}
          </div>
        </a>
      </section>
    );
    const Introduction5 = () => (
      <section className={clsx(styles.section, styles.textCenter)}>
        <a
          className={auditStatus !== AUDITING ? styles.sectionTrigger : ''}
          onClick={() => this.handleModalVisible(ModalType.Introduction5)}
        >
          <Row type='flex' align='middle' gutter={15}>
            <Col span={24}>
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner6.title' />
              </Typography.Title>
            </Col>
            <Col span={24}>
              <img className={styles.banner} src={introduction5} alt='' />
            </Col>
          </Row>
          <div className={styles.coverWrapper}>
            <div>
              <Typography.Title level={2} className={styles.title}>
                <FormattedMessage id='website.banner.edit.introduction5' />
              </Typography.Title>
              <Icon className={styles.icon} type='edit' />
              <Typography.Title level={4}>
                <FormattedMessage id='website.banner.edit.tip' />
              </Typography.Title>
            </div>
            {/* <div className={styles.switch}>
              <Switch
                size='small'
                style={{ width: 35 }}
                defaultChecked={display}
                onChange={(checked, e) => this.handleDisplayChange(checked, e, formKeys.intro5)}
              />
              <Typography.Text>
                <FormattedMessage id='website.banner.display.tip' />
              </Typography.Text>
            </div> */}
          </div>
        </a>
      </section>
    );
    return (
      <div className={styles.root}>
        <PageHeaderWrapper>
          <AuditStatus websiteInfo={websiteInfo} />
          <Banner />
          <Introduction1 />
          <Introduction2 />
          <Introduction3 />
          <Introduction4 />
          <Introduction5 />
          <ButtomBtn {...buttomBtnProps} />
          <BannerModal
            visiable={modalVisible}
            detail={this.modalDetail}
            handleCancel={this.handleModalClose}
            handleOk={this.handleOk}
            modalType={modalType}
          />
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default WebsiteManagemnet;
