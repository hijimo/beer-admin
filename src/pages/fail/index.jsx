import { Button, Card, Result } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { router } from 'umi';

export default () => (
  <GridContent>
    <Card bordered={false}>
      <Result
        status='error'
        title={formatMessage({
          id: 'result-fail.error.title',
        })}
        subTitle={formatMessage({
          id: 'result-fail.error.description',
        })}
        extra={
          <Button onClick={() => router.push('/rfq')} type='primary'>
            <FormattedMessage id='result-fail.error.btn-text' defaultMessage='Return' />
          </Button>
        }
        style={{
          marginTop: 48,
          marginBottom: 16,
        }}
      ></Result>
    </Card>
  </GridContent>
);
