import { Button, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import UploadList from '@common/components/UploadList';
import { updateUserPhoto } from '@/services/account';
import styles from '../style.less';

class AvatarView extends Component {
  state = {
    avatarLoading: false,
    avatarFiles: [],
  };

  handleUploadChange = ({ file, fileList }) => {
    const { dispatch } = this.props;
    this.setState({
      avatarFiles: fileList,
    });
    if (file.status === 'done') {
      this.setState({
        avatarLoading: true,
      });
      updateUserPhoto({
        userPhoto: file.url,
      }).then(({ success }) => {
        this.setState({
          avatarLoading: false,
        });
        if (success) {
          message.success('success');
          dispatch({
            type: 'user/fetchCurrent',
          });
        }
      });
    }
  };

  render() {
    const { avatar } = this.props;
    const { avatarLoading, avatarFiles } = this.state;
    return (
      <Fragment>
        <div className={styles.avatar_title}>
          <FormattedMessage id='app.account.photo' defaultMessage='Photo' />
        </div>
        <div className={styles.avatar}>
          <img src={avatar} alt='avatar' />
        </div>
        <UploadList
          accpet='.jpeg, .jpg, .png'
          maxSize={10 * 1024}
          value={avatarFiles}
          onOriginChange={this.handleUploadChange}
          showUploadList={false}
        >
          <div className={styles.button_view}>
            <Button icon='upload' loading={avatarLoading}>
              <FormattedMessage id='app.account.change-photo' defaultMessage='Change Photo' />
            </Button>
          </div>
        </UploadList>
      </Fragment>
    );
  }
}

export default AvatarView;
