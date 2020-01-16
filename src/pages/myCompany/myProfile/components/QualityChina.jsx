import { Card, Badge, Button } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import _get from 'lodash/get';
import { fetchQualityChina } from '@/services/profile';
import HasLicense from './HasLicense';
import NoLicense from './NoLicense';
import ChooseUpdate from './ChooseUpdate';
import styles from '../../style.less';

const auditStatusColor = ['cyan', 'orange', 'green', 'red', 'red'];
const auditStatusBgColor = [
  'rgba(255,255,255,1)',
  'rgba(255,242,232,1)',
  'rgba(246,255,237,1)',
  'rgba(255,241,240,1)',
  'rgba(255,241,240,1)',
];

@connect(({ myCompany, user }) => ({
  myCompany,
  user,
}))
class QualityChina extends Component {
  state = {
    qualityChina: {},
    modalVisible: false,
  };

  componentDidMount() {
    this.fetchQualityChinaMethod();
  }

  fetchQualityChinaMethod = () => {
    const {
      user: { currentUser },
    } = this.props;
    const params = { companyNo: currentUser.companyNo };
    fetchQualityChina(params).then(res => {
      const { success, data } = res;
      if (success) {
        this.setState({
          qualityChina: data,
        });
      }
    });
  };

  toggleModalVisible = e => {
    if (e) {
      e.preventDefault();
    }
    const { modalVisible } = this.state;
    this.setState({ modalVisible: !modalVisible });
  };

  render() {
    const { qualityChina = {}, modalVisible } = this.state;
    const { auditStatus, auditStatusText } = qualityChina;
    const hasLicense = _get(qualityChina, 'zjCertFlag', false);
    return (
      <>
        <Card
          title={
            <div>
              {formatMessage({ id: 'profile.quality-China' })}
              <Badge
                count={auditStatusText}
                style={{
                  marginLeft: '20px',
                  backgroundColor: auditStatusBgColor[auditStatus || 0],
                  color: auditStatusColor[auditStatus || 0],
                  border: `1px solid ${auditStatusColor[auditStatus || 0]}`,
                }}
              />
            </div>
          }
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={
            <Button type='link' onClick={this.toggleModalVisible} disabled={auditStatus === 1}>
              {formatMessage({ id: 'yeeorder.Update' })}
            </Button>
          }
          className={styles.qualityChina}
        >
          {hasLicense ? (
            <HasLicense qualityChina={qualityChina} />
          ) : (
            <NoLicense qualityChina={qualityChina} />
          )}
          <ChooseUpdate visible={modalVisible} handleCancel={this.toggleModalVisible} />
        </Card>
      </>
    );
  }
}

export default QualityChina;
