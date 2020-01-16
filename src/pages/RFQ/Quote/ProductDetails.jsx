import { Card, Form, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import React, { PureComponent } from 'react';
import TextArea from '@common/components/TextArea/TextArea';
import { QuoteKeys } from './enum';
// import { regexpEngNumSpc } from '@/utils/validate';
// import { blankCheck } from './validator';

const FormItem = Form.Item;
const { ProductDetail } = QuoteKeys;

class ProductDetails extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const colLayout = {
      xl: { span: 12 },
      lg: { span: 16 },
      md: { span: 24 },
      sm: { span: 24 },
    };
    return (
      <>
        <Card
          title={
            <span className='ant-form-item-required'>
              {/* <span style={{
                color: '#f5222d',
                marginRight: 4,
              }}>*</span> */}
              {formatMessage({ id: ProductDetail.label })}
            </span>
          }
          bordered={false}
          style={{ marginTop: 24 }}
        >
          <Row gutter={16} type='flex'>
            <Col {...colLayout}>
              <FormItem required>
                {getFieldDecorator(ProductDetail.key, {
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: `${formatMessage({ id: ProductDetail.required })}`,
                    },
                    // {
                    //   pattern: regexpEngNumSpc,
                    //   message: `${formatMessage({ id: 'yeeorder.regexp.eng_num_spc.msg' })}`,
                    // },
                    // {
                    //   validator: blankCheck,
                    // },
                  ],
                })(
                  <TextArea
                    maxLength={500}
                    rows={4}
                    autoComplete='off'
                    placeholder={formatMessage({ id: 'yeeorder.please-input' })}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}

export default ProductDetails;
