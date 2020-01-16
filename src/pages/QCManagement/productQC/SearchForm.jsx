import { Form, Row, Col, Input, Select, Button, Icon } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { QcListKeys } from '../enum';
import { fetchDictList } from '@/services/profile';

const FormItem = Form.Item;
const { Option } = Select;
const { QCNO, Buyer, PONo, Status } = QcListKeys;

class ProductQCForm extends Component {
  state = {
    expandForm: false,
    // dictList: {},
  };

  componentDidMount() {
    // this.fetchDictListMethod();
  }

  fetchDictListMethod = async () => {
    const dictKey = ['audit'];
    const { success } = await fetchDictList(dictKey);
    if (success) {
      // this.setState({ dictList: data });
    }
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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
    this.props.handleSearch(getFieldsValue());
  };

  render() {
    const { expandForm } = this.state;
    // const { expandForm, dictList } = this.state;
    // const { audit = [] } = dictList;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const gutterLayout = {
      md: 8,
      lg: 24,
      xl: 24,
    };
    const renderSimpleForm = () => (
      <Form layout='inline'>
        <Row gutter={gutterLayout} type='flex'>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: QCNO.label })}>
              {getFieldDecorator(QCNO.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: Buyer.label })}>
              {getFieldDecorator(Buyer.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={{ whiteSpace: 'nowrap' }}>
              <Button type='primary' onClick={this.handleSearch}>
                {formatMessage({ id: 'yeeorder.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'yeeorder.reset' })}
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {`${formatMessage({ id: 'yeeorder.form.More' })} `}
                <Icon type='down' />
              </a>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
    const renderAdvancedForm = () => (
      <Form layout='inline'>
        <Row gutter={gutterLayout} type='flex'>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: QCNO.label })}>
              {getFieldDecorator(QCNO.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: Buyer.label })}>
              {getFieldDecorator(Buyer.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: PONo.label })}>
              {getFieldDecorator(PONo.key)(
                <Input
                  autoComplete='off'
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label={formatMessage({ id: Status.label })}>
              {getFieldDecorator(Status.key)(
                <Select
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                >
                  {/* {audit.map(({ value, text }) => (
                    <Option value={value}>{text}</Option>
                  ))} */}
                  <Option value={1}>Pass</Option>
                  <Option value={2}>Fail</Option>
                  <Option value={3}>Pending</Option>
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
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              {`${formatMessage({ id: 'yeeorder.form.Less' })} `}
              <Icon type='up' />
            </a>
          </div>
        </div>
      </Form>
    );
    return (
      <div className='tableListForm'>{expandForm ? renderAdvancedForm() : renderSimpleForm()}</div>
    );
  }
}

export default Form.create()(ProductQCForm);
