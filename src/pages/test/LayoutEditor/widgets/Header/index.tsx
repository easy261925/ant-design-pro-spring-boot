import React, { CSSProperties } from 'react';
import { Layout } from 'antd';
import { HeaderProps } from '@ant-design/pro-layout';

interface CustomHeaderProps {
  style?: CSSProperties;
  title?: string;
  backgroundColor?: string;
  color?: string;
}

const Header: React.FC<HeaderProps & CustomHeaderProps> = (props) => {
  const { title = '头部导航', backgroundColor = '#255796', color = '#fff' } = props;
  return (
    <Layout.Header
      style={{
        height: '100%',
        minHeight: 40,
        color,
        lineHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor,
      }}
      {...props}
    >
      {title}
    </Layout.Header>
  );
};

export default Header;
