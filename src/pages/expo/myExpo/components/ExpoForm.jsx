import { Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { fetchDictList } from '@/services/profile';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FORM_KEYS = {
  EXPO_NAME: 'epName',
  EXPO_DATE: 'expoDate',
  EXPO_STATUS: 'actStatus',
};

class ExpoForm extends Component {
  state = {
    dictList: {},
  };

  componentDidMount() {
    this.fetchDictListMethod();
  }

  fetchDictListMethod = async () => {
    const dictKey = ['expoActivityStatus'];
    const { success, data } = await fetchDictList(dictKey);
    if (success) {
      this.setState({ dictList: data });
    }
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
    const { expoDate = [] } = searchParams;
    this.props.handleSearch(
      Object.assign({}, searchParams, {
        gmtStart:
          expoDate[0] &&
          moment(expoDate[0])
            .startOf('day')
            .toISOString(),
        gmtEnd:
          expoDate[1] &&
          moment(expoDate[1])
            .endOf('day')
            .toISOString(),
        expoDate: undefined,
      }),
    );
  };

  render() {
    const { dictList } = this.state;
    const { expoActivityStatus = [] } = dictList;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const rowGutter = {
      md: 8,
      lg: 24,
      xl: 24,
    };
    return (
      <div className='tableListForm'>
        <Form layout='inline'>
          <Row gutter={rowGutter} type='flex'>
            <Col lg={8} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'my-expo.form.expo-name' })}>
                {getFieldDecorator(FORM_KEYS.EXPO_NAME)(
                  <Input
                    autoComplete='off'
                    style={{ width: '100%' }}
                    placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                  />,
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'my-expo.form.expo-date' })}>
                {getFieldDecorator(FORM_KEYS.EXPO_DATE)(
                  <RangePicker style={{ width: '100%' }} format='YYYY-MM-DD' />,
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'my-expo.form.status' })}>
                {getFieldDecorator(FORM_KEYS.EXPO_STATUS)(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                  >
                    {expoActivityStatus.map(({ value, text }) => (
                      <Option key={value} value={value}>
                        {text}
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
                <FormattedMessage id='yeeorder.search' defaultMessage='Search' />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id='yeeorder.reset' defaultMessage='Reset' />
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ExpoForm);
