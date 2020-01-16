import { Card, Col, Row, Statistic, Badge, Skeleton } from 'antd';
import React from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import _get from 'lodash/get';
import _split from 'lodash/split';
import numeral from 'numeral';
import styles from '../style.less';

const calMax = arr => {
  if (!Array.isArray(arr)) return 0;
  const max = Math.max(...arr);
  const { length } = Math.ceil(max).toString();
  const zeroArr = new Array(length - 1).fill(0);
  zeroArr.unshift(1);
  const scaleplate = Number(zeroArr.join(''));
  const maxint = Math.ceil(max / scaleplate); // 向上取整
  return maxint * scaleplate; // 最终设置的最大值
};

const getOption = lineData => {
  const items = _get(lineData, 'items', []) || [];
  const xData = items.map(({ monthTag }) => monthTag);
  const rfqNumList = items.map(({ rfqNum }) => rfqNum);
  const orderNumList = items.map(({ orderNum }) => orderNum);
  const amountList = items.map(({ amount }) => amount);
  const amountTextList = items.map(({ amountText }) => amountText);
  const yMaxL = calMax([...rfqNumList, ...orderNumList]) || 100;
  const yMaxR = calMax([...amountList]);
  return {
    title: {
      text: '',
    },
    tooltip: {
      trigger: 'axis',
      formatter: data => {
        let str = `${data[0].axisValue}<br />`;
        data.forEach((item, index) => {
          str += `
            ${item.marker}
            ${item.seriesName}:
            ${index === 2 ? _split(amountTextList[item.dataIndex], '.')[0] : item.value}
            <br />
          `;
        });
        return str;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
    },
    yAxis: [
      {
        type: 'value',
        name: 'Number',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#E8E8E8',
            type: 'dashed',
          },
        },
        splitNumber: 5,
        min: 0,
        max: yMaxL,
        interval: yMaxL / 5,
      },
      {
        type: 'value',
        name: 'USD',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#E8E8E8',
            type: 'dashed',
          },
        },
        splitNumber: 5,
        scale: true,
        min: 0,
        max: yMaxR,
        interval: yMaxR / 5,
      },
    ],
    series: [
      {
        name: 'No. of Rfq',
        type: 'line',
        data: rfqNumList,
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(194, 53, 49, .6)',
                },
                {
                  offset: 0.8,
                  color: 'rgba(194, 53, 49, 0)',
                },
              ],
              false,
            ),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10,
          },
        },
      },
      {
        name: 'No. of Orders',
        type: 'line',
        data: orderNumList,
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(47, 69, 84, .6)',
                },
                {
                  offset: 0.8,
                  color: 'rgba(47, 69, 84, 0)',
                },
              ],
              false,
            ),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10,
          },
        },
      },
      {
        name: 'Total Amount',
        type: 'line',
        data: amountList,
        smooth: true,
        yAxisIndex: 1,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(97, 160, 168, .6)',
                },
                {
                  offset: 0.8,
                  color: 'rgba(97, 160, 168, 0)',
                },
              ],
              false,
            ),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10,
          },
        },
      },
    ],
  };
};

const PurchaseOrderData = ({ lineData }) => (
  <Card
    title={<FormattedMessage id='home.purchase-order-data' defaultMessage='Purchase Order Data' />}
    bordered={false}
  >
    <Skeleton paragraph loading={!lineData}>
      <Row>
        <Col md={8} sm={12} xs={24}>
          <Statistic
            title={
              <Badge
                color='#c23531'
                text={
                  <FormattedMessage id='home.No-of-inquires' defaultMessage='No. of Inquires' />
                }
              />
            }
            value={numeral(lineData.totalRfqNum).format('0,0')}
          />
        </Col>
        <Col md={8} sm={12} xs={24}>
          <Statistic
            title={
              <Badge
                color='#2f4554'
                text={<FormattedMessage id='home.No-of-orders' defaultMessage='No. of Orders' />}
              />
            }
            value={numeral(lineData.totalOrderNum).format('0,0')}
          />
        </Col>
        <Col md={8} sm={12} xs={24}>
          <Statistic
            title={
              <Badge
                color='#61a0a8'
                text={<FormattedMessage id='home.total-amount' defaultMessage='Total Amount' />}
              />
            }
            value={_split(lineData.totalAmountText, '.')[0]}
          ></Statistic>
        </Col>
      </Row>
    </Skeleton>
    <Skeleton paragraph loading={!lineData}>
      <div className={styles.mapChart}>
        <ReactEcharts
          option={getOption(lineData)}
          notMerge
          lazyUpdate
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </Skeleton>
  </Card>
);

export default PurchaseOrderData;
