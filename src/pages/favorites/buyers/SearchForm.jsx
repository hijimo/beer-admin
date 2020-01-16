import { Form, Row, Col, Cascader, Input, Select, Button } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const FORM_KEYS = {
  Buyer: 'buyerName',
  Category: 'category',
  Country: 'country',
};

@connect(({ common }) => ({
  categoryTree: common.categoryTree || [],
  country: common.country || [],
}))
class BuyerSearchForm extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchCategory',
      payload: {
        toLevel: 2,
      },
    });
    dispatch({
      type: 'common/fetchCountry',
      payload: {
        toLevel: 1,
      },
    });
  }

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
    const {
      form: { getFieldDecorator },
      categoryTree,
      country,
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
              <FormItem label={formatMessage({ id: 'favorites.buyer.buyer' })}>
                {getFieldDecorator(FORM_KEYS.Buyer)(
                  <Input
                    autoComplete='off'
                    style={{ width: '100%' }}
                    placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                  />,
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'favorites.buyer.category' })}>
                {getFieldDecorator(FORM_KEYS.Category)(
                  <Cascader
                    placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                    options={categoryTree}
                  />,
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <FormItem label={formatMessage({ id: 'favorites.buyer.country' })}>
                {getFieldDecorator(FORM_KEYS.Country)(
                  <Select
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    style={{ width: '100%' }}
                    placeholder={formatMessage({ id: 'yeeorder.please-select' })}
                  >
                    {country.map(({ id, name }) => (
                      <Option key={id} value={id}>
                        {name}
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

export default Form.create()(BuyerSearchForm);
