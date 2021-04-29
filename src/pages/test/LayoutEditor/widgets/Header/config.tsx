import React from 'react';
import { Form, Input, Popover } from 'antd';
import { TwitterPicker } from 'react-color';
import { colors, primaryColor } from '../data';

interface HeaderConfigProps {
  editConfig?: any;
  updateEditConfig: (editConfig: any, config: any) => void;
}

const HeaderConfig: React.FC<HeaderConfigProps> = (props) => {
  const { editConfig, updateEditConfig } = props;

  const colorStyle = {
    width: '100%',
    height: 30,
    padding: 6,
    border: '1px solid #000',
  };

  const popoverStyle = {
    width: '168px',
  };

  return (
    <Form>
      <Form.Item label="组件名称" name="term" initialValue={editConfig?.term}>
        <Input disabled />
      </Form.Item>
      <Form.Item label="标题" name="username" initialValue={editConfig?.termConfig?.title}>
        <Input
          onBlur={(e: React.FormEvent<HTMLInputElement>) =>
            updateEditConfig(editConfig, { title: e.currentTarget.value })
          }
        />
      </Form.Item>
      <Form.Item label="背景颜色" name="backgroundColor">
        <div>
          <Popover
            content={
              <div style={popoverStyle}>
                <TwitterPicker
                  width={popoverStyle.width}
                  colors={colors}
                  color={editConfig?.termConfig?.backgroundColor || primaryColor}
                  onChangeComplete={(color) => {
                    updateEditConfig(editConfig, { backgroundColor: color.hex });
                  }}
                />
              </div>
            }
            title="选择背景颜色"
          >
            <div
              style={{
                ...colorStyle,
                backgroundColor: editConfig?.termConfig?.backgroundColor || primaryColor,
              }}
            ></div>
          </Popover>
        </div>
      </Form.Item>
      <Form.Item label="文字颜色" name="color">
        <div>
          <Popover
            content={
              <div style={popoverStyle}>
                <TwitterPicker
                  width={popoverStyle.width}
                  colors={colors}
                  color={editConfig?.termConfig?.color || primaryColor}
                  onChangeComplete={(color) => {
                    updateEditConfig(editConfig, { color: color.hex });
                  }}
                />
              </div>
            }
            title="选择文字颜色"
          >
            <div
              style={{
                ...colorStyle,
                color: editConfig?.termConfig?.color || primaryColor,
              }}
            ></div>
          </Popover>
        </div>
      </Form.Item>
    </Form>
  );
};

export default HeaderConfig;
