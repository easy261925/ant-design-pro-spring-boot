import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Row, Tooltip } from 'antd';
import React, { ReactNode } from 'react';

interface StatisticCardProps {
  title?: string;
  tooltip?: string;
  footer?: string;
  content?: ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = (props) => {
  const { title, tooltip, footer, content } = props;
  return (
    <Card bodyStyle={{ padding: '20px 24px 8px 24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 18, zIndex: 999 }}>
        <span>{title}</span>
        <Tooltip title={tooltip}>
          <QuestionCircleOutlined />
        </Tooltip>
      </Row>
      {content}
      <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 12, paddingTop: 12 }}>{footer}</div>
    </Card>
  );
};

export default StatisticCard;
