import React from 'react';
import { Chart, Geom, Tooltip } from 'bizcharts';
import moment from 'moment';
import autoHeight from '../autoHeight';
import styles from '../index.less';

const visitData: { x: string; y: number }[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

export interface MiniBarProps {
  color?: string;
  height?: number;
  data?: {
    x: number | string;
    y: number;
  }[];
  forceFit?: boolean;
  style?: React.CSSProperties;
}

const MiniBar: React.FC<MiniBarProps> = (props) => {
  const { height = 0, forceFit = true, color = '#1890FF', data = visitData } = props;
  const scale = {
    x: {
      type: 'cat',
    },
    y: {
      min: 0,
    },
  };

  const padding: [number, number, number, number] = [36, 5, 30, 5];

  const tooltip: [string, (...args: any[]) => { name?: string; value: string }] = [
    'x*y',
    (x: string, y: string) => ({
      name: x,
      value: y,
    }),
  ];

  // for tooltip not to be hide
  const chartHeight = height + 54;

  return (
    <div className={styles.miniChart} style={{ height }}>
      <div className={styles.chartContent}>
        <Chart scale={scale} height={chartHeight} forceFit={forceFit} data={data} padding={padding}>
          <Tooltip showTitle={false} crosshairs={false} />
          <Geom type="interval" position="x*y" color={color} tooltip={tooltip} />
        </Chart>
      </div>
    </div>
  );
};
export default autoHeight()(MiniBar);
