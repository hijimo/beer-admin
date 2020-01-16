import React, { Fragment } from 'react';
import { List } from 'antd';

function SecurityView({ data }) {
  return (
    <Fragment>
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={item => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </Fragment>
  );
}

export default SecurityView;
