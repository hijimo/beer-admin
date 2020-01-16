import { Card, Skeleton } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ReactEcharts from 'echarts-for-react';
import _get from 'lodash/get';

const getOption = radarData => {
  const maxData = _get(radarData, 'maxData', {}) || {};
  const supplierList = _get(radarData, 'supplierList', []) || [];
  const color = [
    {
      border: '#1890FF',
      start: '#2F54EB',
      end: '#C4DFFF',
    },
    {
      border: '#1890FF',
      start: '#FFFFFF',
      end: '#6236FF',
    },
  ];
  const dataRadar = supplierList.map((item, index) => {
    const {
      supplierName,
      produceCycle,
      qcPassRate,
      responseHours,
      timelyRate,
      totalAmount,
      totalAmountText,
    } = item;
    return {
      value: [qcPassRate, produceCycle, timelyRate, totalAmount, responseHours],
      valueText: [
        `${qcPassRate}%`,
        `${produceCycle} ${
          produceCycle > 1
            ? formatMessage({ id: 'yeeorder.days' })
            : formatMessage({ id: 'yeeorder.day' })
        }`,
        `${timelyRate}%`,
        totalAmountText,
        `${responseHours} ${
          responseHours > 1
            ? formatMessage({ id: 'yeeorder.hours' })
            : formatMessage({ id: 'yeeorder.hour' })
        }`,
      ],
      name: supplierName,
      lineStyle: {
        color: color[index].border,
      },
      itemStyle: {
        color: color[index].border,
      },
      areaStyle: {
        color: {
          colorStops: [
            {
              offset: 0,
              color: color[index].start, // 0% 处的颜色
            },
            {
              offset: 1,
              color: color[index].end, // 100% 处的颜色
            },
          ],
        },
      },
    };
  });
  return {
    title: {
      text: '',
    },
    tooltip: {
      formatter: data => {
        const nameMap = [
          'home.tooltip.qc-pass-rate',
          'home.tooltip.avg-leadtime',
          'home.tooltip.DIFOT',
          'home.tooltip.total-trade-volume',
          'home.tooltip.avg-response-hours',
        ];
        let str = `${data.name}<br />`;
        nameMap.forEach((item, index) => {
          str += `
            ${formatMessage({ id: item }).replace(/\//g, ' ')}:
            ${data.data.valueText[index]}
            <br />
          `;
        });
        return str;
      },
    },
    axisLabel: {},
    radar: {
      radius: '50%',
      name: {
        textStyle: {
          color: '#999',
          backgroundColor: '#fff',
          borderRadius: 3,
          padding: [3, 5],
          width: '100%',
          fontWeight: 'bolder',
        },
        formatter: val => {
          const text = formatMessage({ id: val });
          return text
            .split(' ')
            .join('\n')
            .replace(/\//g, ' ');
        },
      },
      splitArea: {
        show: false,
      },
      indicator: [
        { name: 'home.qc-pass-rate', max: maxData.qcPassRate },
        { name: 'home.avg-leadtime', max: maxData.produceCycle },
        { name: 'home.DIFOT', max: maxData.timelyRate },
        { name: 'home.total-trade-volume', max: maxData.totalAmount },
        { name: 'home.avg-response-hours', max: maxData.responseHours },
      ],
    },
    series: [
      {
        name: 'Company Name',
        type: 'radar',
        data: dataRadar,
      },
    ],
  };
};
const SupplierMatrix = ({ radarData }) => (
  <Card
    style={{ height: '100%' }}
    bordered={false}
    title={formatMessage({ id: 'home.supplier-matrix' })}
  >
    <div style={{ width: '100%', height: 360 }}>
      <Skeleton paragraph loading={!radarData}>
        <ReactEcharts
          option={getOption(radarData)}
          notMerge
          lazyUpdate
          style={{ width: '100%', height: '100%' }}
        />
      </Skeleton>
    </div>
  </Card>
);

export default SupplierMatrix;
