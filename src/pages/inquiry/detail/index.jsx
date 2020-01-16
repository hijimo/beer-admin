import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import _get from 'lodash/get';
import InquiryInfo from './components/InquiryInfo';
import Dialogue from './components/Dialogue';

@connect(({ inquiry, loading }) => ({
  inquiryDetail: inquiry.detail,
  pageloading: loading.effects['inquiry/fetchInquiryDetail'],
}))
class InquiryDetail extends Component {
  componentDidMount() {
    this.getInquiryDetail();
  }

  getInquiryDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'inquiry/fetchInquiryDetail',
      payload: {
        contactId: _get(this.props, 'match.params.id'),
      },
    });
  };

  render() {
    const { inquiryDetail, pageloading } = this.props;
    const contactId = _get(this.props, 'match.params.id');
    const inquiryType = _get(this.props, 'inquiryDetail.inquiryType');
    return (
      <PageHeaderWrapper
        title={`${formatMessage({ id: 'inquiry.inquiry-no' })}: ${inquiryDetail.contactNo}`}
        content={<InquiryInfo detail={inquiryDetail} loading={pageloading} />}
      >
        <Card bodyStyle={{ padding: '24px 24px 0' }} bordered={false}>
          <Row gutter={24} type='flex'>
            <Col xl={24} xxl={14}>
              <Dialogue contactId={contactId} inquiryType={inquiryType} />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InquiryDetail;
