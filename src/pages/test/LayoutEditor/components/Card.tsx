import React from 'react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

const LECard: React.FC<CardProps> = (props) => {
  const { children } = props;
  return (
    <Card size="small" bodyStyle={{ minHeight: 500 }} {...props}>
      {children}
    </Card>
  );
};

export default LECard;
