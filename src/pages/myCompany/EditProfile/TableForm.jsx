import { Input, Table, Select } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import _isEqual from 'lodash/isEqual';
import { fetchUomEnum } from '@/services/profile';

const { Option } = Select;

class TableForm extends PureComponent {
  static getDerivedStateFromProps(nextProps, preState) {
    if (_isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      uonEnum: [],
    };
  }

  componentDidMount() {
    fetchUomEnum().then(res => this.setState({ uonEnum: res }));
  }

  handleFieldChange = (e, fieldName, key) => {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({
        data: newData,
      });
    }
  };

  getRowByKey = (key, newData) => {
    const { data = [] } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  };

  render() {
    const { loading, data, uonEnum = [] } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'profile.product-name' }),
        dataIndex: 'productName',
        render: (text, record) => (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'productName', record.key)}
            placeholder={formatMessage({ id: 'yeeorder.please-input' })}
          />
        ),
      },
      {
        title: formatMessage({ id: 'profile.quantity' }),
        dataIndex: 'quantity',
        render: (text, record) => (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'quantity', record.key)}
            placeholder={formatMessage({ id: 'yeeorder.please-input' })}
          />
        ),
      },
      {
        title: formatMessage({ id: 'profile.uom' }),
        dataIndex: 'uom',
        width: '250px',
        render: (text, record) => (
          <Select
            placeholder={formatMessage({ id: 'yeeorder.please-select' })}
            value={text}
            onChange={e => this.handleFieldChange(e, 'uom', record.key)}
          >
            {uonEnum.map(({ code, value }) => (
              <Option key={code} value={code}>
                {value}
              </Option>
            ))}
          </Select>
        ),
      },
    ];
    return <Table loading={loading} columns={columns} dataSource={data} pagination={false} />;
  }
}

export default TableForm;
