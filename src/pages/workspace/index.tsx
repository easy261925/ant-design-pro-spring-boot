import React from 'react';
import { Row, Col, Statistic } from 'antd';
import StatisticCard from './components/StatisticCard';
import MiniBar from './components/MiniBar';
import MiniProgress from './components/MiniProgress';
import MiniArea from './components/MiniArea';

const OverView = () => {
  return (
    <div>
      <Row gutter={24}>
        <Col span={6}>
          <StatisticCard
            title="今日产量"
            tooltip="今日产量"
            footer="同比增长 : 12%"
            content={
              <Statistic
                style={{
                  height: 75,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                value={1380.32}
                suffix="吨"
              />
            }
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="本月产量分布图"
            tooltip="本月产量分布图"
            footer="平均每月 : 1232.23 吨"
            content={<MiniBar />}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="今日产量完成度"
            tooltip="今日产量完成度"
            footer="同比增长 10%"
            content={
              <div
                style={{
                  height: 75,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Statistic value="78%" />
                <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
              </div>
            }
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="年度产量趋势"
            tooltip="年度产量趋势"
            footer="同比增长 18%"
            content={<MiniArea color="#975FE4" />}
          />
        </Col>
      </Row>
    </div>
  );
};

export default OverView;
