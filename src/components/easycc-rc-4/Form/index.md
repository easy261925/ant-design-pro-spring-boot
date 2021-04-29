## Form

表单组件:

### 何时使用

- 用于创建一个实体或收集信息
- 需要对输入的数据类型进行校验时。

### 使用示例

```tsx
import React, { useState } from 'react';
import { CCForm } from 'easycc-rc-4';
import { Button, Divider, Input, Form, Select, Spin } from 'antd';

const multipleEnum = {
  a: { text: '多选项0', status: 'Default' },
  b: { text: '多选项1', status: 'Processing' },
  c: { text: '多选项2', status: 'Success' },
  d: { text: '多选项3', status: 'Error' },
};

const index = () => {
  const [record, setRecord] = useState(null);
  const [form] = Form.useForm();
  const columns: CCColumns<TestInterface>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      tooltip: '用户名',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '用户名为必填项',
          },
        ],
      },
      render: (dom, entity) => (
        <CCDrawer formmode={FormModeEnum.view} columns={columns} record={entity}>
          <a>{dom}</a>
        </CCDrawer>
      ),
      formItem: {
        colLayout: { span: 12 },
        formItemLayout: {
          labelCol: {
            span: 8,
          },
          wrapperCol: {
            span: 16,
          },
        },
        props: {
          placeholder: '请输入用户名',
        },
      },
    },
    {
      title: '密码',
      dataIndex: 'password',
      tooltip: 'password',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请填写密码',
          },
        ],
      },
      hideInTable: true,
      formItem: {
        colLayout: { span: 12 },
        formItemLayout: {
          labelCol: {
            span: 8,
          },
          wrapperCol: {
            span: 16,
          },
        },
        element: <Input.Password placeholder="请输入密码" />,
      },
    },
    {
      title: '多行文本',
      dataIndex: 'textarea',
      tooltip: '这是多行文本',
      valueType: 'textarea',
      ellipsis: true,
      formItem: {
        props: {
          placeholder: '请输入多行文本',
          autoSize: {
            minRows: 4,
            maxRows: 6,
          },
        },
      },
      // hideInTable: true,
      // formItem: {
      //   element: <Input.TextArea placeholder="请输入多行文本" />,
      // },
    },
    {
      title: '选择',
      dataIndex: 'select',
      tooltip: '这是选择',
      valueEnum: {
        0: { text: '选项0', status: 'Default' },
        1: { text: '选项1', status: 'Processing' },
        2: { text: '选项2', status: 'Success' },
        3: { text: '选项3', status: 'Error' },
      },
      formItem: {
        props: {
          placeholder: '请单选',
          rules: [
            {
              required: true,
              message: '请选择选项',
            },
          ],
        },
      },
    },
    {
      title: '多选',
      dataIndex: 'multiple',
      valueEnum: multipleEnum,
      renderText: (val) => val.map((item: string) => multipleEnum[item].text).join(','),
      formItem: {
        props: {
          mode: 'multiple',
          placeholder: '请多选',
          rules: [
            {
              required: true,
            },
          ],
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'dtCreaDateTime',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '选择时间',
      dataIndex: 'dateRange',
      search: false,
      valueType: 'dateTimeRange',
    },
    {
      title: '数字',
      dataIndex: 'digit',
      search: false,
      valueType: 'digit',
      formItem: {
        props: {
          max: 20,
        },
      },
    },
    {
      title: '切换',
      dataIndex: 'switch',
      formItem: {
        props: {
          eltype: 'switch',
        },
      },
      search: false,
      hideInTable: true,
      render: (val) => (val ? '选中' : '未选中'),
    },
    {
      title: '上传图片',
      dataIndex: 'uploadFile',
      search: false,
      formItem: {
        props: {
          eltype: 'upload',
          action: '/upload.do',
          // listType: 'picture',
          multiple: true,
          fileNameKey: 'fileName',
          // children: <a>上传文件</a>,
        },
      },
      hideInTable: true,
      renderText: (val, entity) => {
        if (entity.uploadFile && entity.uploadFile.length > 0) {
          return entity.uploadFile.map((file) => {
            return <img src={file.url} key={file.id} style={{ width: 40 }} />;
          });
        }
        return null;
      },
    },
    {
      title: '选择联系人',
      dataIndex: 'selectSearch',
      formItem: {
        eltype: 'selectSearch',
        element: (
          <Select
            mode="multiple"
            placeholder="选择联系人"
            notFoundContent={<Spin size="small" />}
            filterOption={false}
            onSearch={(value) => {
              console.log('value', value);
            }}
            style={{ width: '100%' }}
          >
            {[{ text: '用户一', value: '1' }].map((d) => (
              <Select.Option key={d.value} value={d.value}>
                {d.text}
              </Select.Option>
            ))}
          </Select>
        ),
      },
    },
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, entity) => (
    //     <Fragment>
    //       <CCDrawer
    //         formmode={FormModeEnum.update}
    //         columns={columns}
    //         record={entity}
    //         onFinish={onFinish}
    //       >
    //         <a>修改</a>
    //       </CCDrawer>
    //       <Divider type="vertical" />
    //       <a>删除</a>
    //     </Fragment>
    //   ),
    // },
  ];
  return (
    <Form>
      <Form form={form}>
        <CCForm columns={columns} record={record} />
      </Form>
    </Form>
  );
};

export default index;
```

## API

### CCForm

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| columns | 表格列的配置描述，具体项见下表 | `CCColumns[]` |
| colLayout | 每一个 `FormItem` 的默认布局 | `LayoutInterface` | `{ span: 24 }` |
| formItemLayout | 每一个 `FormItem` 中 `label` 与 `元素(比如 Input)` 的默认布局 | `FormItemLayoutInterface` | `{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }` |
| record | 传入编辑的`单条数据` |

### CCColumns

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| valueType | 表单元素的类型, 参考下面 `ValueTypeEnum` | `ValueTypeEnum` |  |  |
| formItem | FormItem 属性,参考下面 `FormItem` 包含 `规则校验`, `colLayout`,`formItemLayout`,`element` ,`props`,`placeholder` | `Object` |
| render | 在`表格`或`Drawer 查看模式下` 显示的自定义内容 |
| renderText | 在`表格`或`Drawer 查看模式下` 显示的自定义内容 |
| title | 在`表格`或`Drawer`中 `label` |
| dataIndex | 在`表格`或`Drawer`中对应后台`接口`返回数据的`键` |
| tooltip | 帮助信息 |
| valueEnum | `Drawer` 中 `多选`,`单选` 使用到的枚举类 |
| search | 是否展示在 `搜索栏` 中 | `boolean` | `true` |
| hideInTable | 是否展示在 `Table` 中 | `boolean` | `false` |
| hideInForm | 是否展示在 `Form` 中 | `boolean` | `false` |

### ValueTypeEnum

| 值            | 说明                                             | 类型 |
| ------------- | ------------------------------------------------ | ---- |
| text          | 文字类型, 表单中为 `Input` 输入框                |
| digit         | 数字类型, 表单中为 `InputNumber` 输入框          |
| textarea      | 多行文字类型, 表单中为 `Input.TextArea` 输入框   |
| date          | 日期类型, 表单中为 `日期` 选择器                 |
| dateWeek      | 周类型, 表单中为 `周` 选择器                     |
| dateMonth     | 月类型, 表单中为 `月` 选择器                     |
| dateQuarter   | 季度类型, 表单中为 `季度` 选择器                 |
| dateYear      | 年类型, 表单中为 `年` 选择器                     |
| dateTime      | 日期时间类型, 表单中为 `日期时间` 选择器         |
| time          | 时间类型, 表单中为 `时间` 选择器                 |
| dateRange     | 日期区间类型, 表单中为 `日期区间` 选择器         |
| dateTimeRange | 日期时间区间类型, 表单中为 `日期时间区间` 选择器 |

### FormItem

| 属性名称       | 说明                                          | 类型        |
| -------------- | --------------------------------------------- | ----------- |
| colLayout      | 自定义 `FormItem` 的布局                      |
| formItemLayout | 自定义 `FormItem` 中 `label` 和 `元素` 的布局 |
| props          | 自定义属性, 参考下面 `FormItemProps`          |             |
| element        | 自定义渲染组件                                | `ReactNode` |

### FormItemProps

| 属性名称 | 说明 | 取值 |
| --- | --- | --- |
| rules | 字段的校验规则定义 |
| placeholder | `Input`、`select`等占位内容 |
| autoSize | `valueType` 为 `textarea`时,`TextArea`的属性等 |
| mode | `valueType` 为 `select`时,需要定义`valueEnum`,并且 `mode` 设置为 `multiple`即可 |
| max，min | `valueType` 为 `digit`时,`InputNumber`的属性等 |
| eltype | `switch切换组件`,`upload上传组件`,`selectSearch动态搜索组件`时使用到的特殊定义 | `switch` ,`upload`, `selectSearch` |
