import React from 'react';
import { Button, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const SearchFormBtn = props => {
  const submitData = (flag = false) => {
    props.submitData(flag);
  };

  const { toggleForm, expandForm } = props;

  const renderBtn = () => {
    if (toggleForm) {
      if (expandForm) {
        return (
          <a className='ml10' onClick={toggleForm}>
            {formatMessage({ id: 'yeeorder.form.Less' })}
            <Icon type='up' />
          </a>
        );
      }
      return (
        <a className='ml10' onClick={toggleForm}>
          {formatMessage({ id: 'yeeorder.form.More' })}
          <Icon type='down' />
        </a>
      );
    }
    return null;
  };

  return (
    <>
      <Button type='primary' onClick={() => submitData(false)}>
        {formatMessage({ id: 'yeeorder.search' })}
      </Button>
      <Button style={{ marginLeft: 8 }} onClick={() => submitData(true)}>
        {formatMessage({ id: 'yeeorder.reset' })}
      </Button>
      {renderBtn()}
    </>
  );
};

export default SearchFormBtn;
