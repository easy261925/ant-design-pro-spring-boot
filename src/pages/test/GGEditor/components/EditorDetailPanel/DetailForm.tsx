import React from 'react';
import { Card, Input, Select, Form } from 'antd';
import { withPropsAPI } from 'gg-editor';

// const upperFirst = (str: string) =>
//   str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

interface DetailFormProps {
  type: string;
  propsAPI?: any;
}

class DetailForm extends React.Component<DetailFormProps> {
  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  handleFieldChange = (values: any) => {
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      const item = getSelected()[0];
      if (!item) {
        return;
      }
      executeCommand(() => {
        update(item, {
          ...values,
        });
      });
    }, 0);
  };

  handleInputBlur = (type: string) => (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };

  renderNodeDetail = () => {
    const { label } = this.item.getModel();

    return (
      <Form initialValues={{ label }}>
        <Item label="标题" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();

    return (
      <Form initialValues={{ label, shape }}>
        <Item label="线标题" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
        <Item label="样式" name="shape" {...inlineFormItemLayout}>
          <Select onChange={(value) => this.handleFieldChange({ shape: value })}>
            <Option value="flow-smooth">弧线</Option>
            <Option value="flow-polyline">直角线</Option>
            <Option value="flow-polyline-round">直角弧线</Option>
          </Select>
        </Item>
      </Form>
    );
  };

  renderGroupDetail = () => {
    const { label = '新建分组' } = this.item.getModel();

    return (
      <Form initialValues={{ label }}>
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  render() {
    const { type } = this.props;
    if (!this.item) {
      return null;
    }

    let cardTitle = '';
    switch (type) {
      case 'node':
        cardTitle = '节点配置';
        break;
      case 'edge':
        cardTitle = '线配置';
        break;
      case 'group':
        cardTitle = '组配置';
        break;
      default:
        break;
    }

    return (
      <Card type="inner" size="small" title={cardTitle} bordered={false}>
        {type === 'node' && this.renderNodeDetail()}
        {type === 'edge' && this.renderEdgeDetail()}
        {type === 'group' && this.renderGroupDetail()}
      </Card>
    );
  }
}

export default withPropsAPI(DetailForm as any);
