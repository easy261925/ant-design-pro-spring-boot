import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { getBarChart, getLineChart, getPieChart } from './chart';
import { ternEum } from '../../data';

interface ChartProps {
  term: ternEum;
}

const Chart: React.FC<ChartProps> = (props) => {
  const { term } = props;
  let option = null;
  if (term === ternEum.Bar) {
    option = getBarChart();
  } else if (term === ternEum.Line) {
    option = getLineChart();
  } else if (term === ternEum.Pie) {
    option = getPieChart();
  }
  return (
    <ReactEcharts option={option} notMerge lazyUpdate style={{ width: '100%', height: '100%' }} />
  );
};

export default Chart;
