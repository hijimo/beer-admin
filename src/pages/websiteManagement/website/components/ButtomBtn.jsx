import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import _get from 'lodash/get';
import BottomPanel from '@/components/BottomPanel';

const DRAFT = 0;
const AUDITING = 3;
class ButtomBtn extends PureComponent {
  render() {
    const { isDataChange, handleSave, handleSubmit, handlePreview, isDisplayChange } = this.props;
    const detail = this.props.detail || [];
    const auditStatus = _get(this.props, 'websiteInfo.pageAudit', 0);
    const showPreview = detail.length; // 只要有数据就能Preview
    const showSave = (isDataChange || isDisplayChange) && auditStatus !== AUDITING;
    const showSubmit = !showSave && auditStatus === DRAFT && showPreview;
    return showPreview || showSave || showSubmit ? (
      <BottomPanel>
        {!!showSave && (
          <Button onClick={() => handleSave()} type='primary'>
            {formatMessage({ id: 'yeeorder.Save' })}
          </Button>
        )}
        {!!showSubmit && (
          <Button onClick={() => handleSubmit()} type='primary' style={{ marginLeft: 16 }}>
            {formatMessage({ id: 'yeeorder.Submit' })}
          </Button>
        )}
        {!!showPreview && (
          <Button onClick={() => handlePreview()} type='primary' style={{ marginLeft: 16 }}>
            {formatMessage({ id: 'yeeorder.Preview' })}
          </Button>
        )}
      </BottomPanel>
    ) : null;
  }
}

export default ButtomBtn;
