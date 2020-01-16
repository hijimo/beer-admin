import { Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { fetchSampleStatusList } from '@/services/sample';
import { StatusMap } from '../enum';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FORM_KEYS = {
  Sample_No: 'sampleNo',
  Sample_Raise_Date: 'gmtCreate',
  Status: 'sampleStatus',
};

class SearchForm extends Component {
  state = {
    dictList: {},
  };

  componentDidMount() {
    this.fetchSampleStatusListMethod();
  }

  fetchSampleStatusListMethod = () => {
    fetchSampleStatusList().then(res => {
      const { success, data } = res;
      if (success) this.setState({ dictList: data });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.handleSearch({});
  };

  handleSearch = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const searchParams = getFieldsValue();
    const { gmtCreate = [] } = searchParams;
    this.props.handleSearch(
      Object.assign({}, searchParams, {
        gmtCreateBegin:
          gmtCreate[0] &&
          moment(gmtCreate[0])
            .startOf('day')
            .toISOString(),
        gmtCreateEnd:
          gmtCreate[1] &&
          moment(gmtCreate[1])
            .endOf('day')
            .toISOString(),
        gmtCreate: undefined,
      }),
    );
  };

  render() {
    const { dictList } = this.state;
    const { sampleStatusEnumList = [] } = dictList;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const gutterLayout = {
      md: 8,
      lg: 24,
      xl: 24,
    };
    return (
      <div className='tableListForm'>
        <Form layout='inline'>
          <Row gutter={gutterLayout} type='flex'>
            <Col lg={8} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'sample.management.sample-no' })}>
                {getFieldDecorator(FORM_KEYS.Sample_No)(
                  <Input
                    autoComplete='off'
                    style={{ width: '100%' }}
                    placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                  />,
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'sample.management.sample-raise-time' })}>
                {getFieldDecorator(FORM_KEYS.Sample_Raise_Date)(
                  <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'sample.management.status' })}>
                {getFieldDecorator(FORM_KEYS.Status)(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                  >
                    {sampleStatusEnumList.map(({ value }) => (
                      <Option key={value} value={value}>
                        {formatMessage({ id: StatusMap[value].text })}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'right', marginBottom: 24 }}>
              <Button type='primary' onClick={this.handleSearch}>
                {formatMessage({ id: 'yeeorder.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'yeeorder.reset' })}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(SearchForm);
