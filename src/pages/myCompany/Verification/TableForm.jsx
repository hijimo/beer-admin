import { Input, Table, Select, InputNumber } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import _isEqual from 'lodash/isEqual';
import { fetchDictList } from '@/services/profile';

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
      dictList: {},
    };
  }

  async componentDidMount() {
    const dictKey = ['uom'];
    const { success, data } = await fetchDictList(dictKey);
    if (success) {
      this.setState({ dictList: data });
    }
  }

  handleFieldChange = (val, fieldName, key) => {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = val;
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
    const {
      loading,
      data,
      dictList: { uom = [] },
    } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'profile.product-name' }),
        dataIndex: 'name',
        render: (text, record) => (
          <Input
            value={text || undefined}
            onChange={e => this.handleFieldChange(e.target.value, 'name', record.key)}
            placeholder={formatMessage({ id: 'yeeorder.please-input' })}
          />
        ),
      },
      {
        title: formatMessage({ id: 'profile.quantity' }),
        dataIndex: 'quantity',
        render: (text, record) => (
          <InputNumber
            value={text || undefined}
            onChange={val => this.handleFieldChange(val, 'quantity', record.key)}
            style={{ width: '100%' }}
            autoComplete='off'
            placeholder={formatMessage({ id: 'yeeorder.please-input' })}
          />
        ),
      },
      {
        title: formatMessage({ id: 'profile.uom' }),
        dataIndex: 'uom',
        width: '250px',
        render: (val, record) => (
          <Select
            allowClear
            defaultValue={val || undefined}
            placeholder={formatMessage({ id: 'yeeorder.please-select' })}
            onChange={value => this.handleFieldChange(value, 'uom', record.key)}
          >
            {uom.map(({ value, text }) => (
              <Option key={value} value={value}>
                {text}
              </Option>
            ))}
          </Select>
        ),
      },
    ];
    return (
      <Table
        rowKey={(row, index) => index}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    );
  }
}

export default TableForm;
