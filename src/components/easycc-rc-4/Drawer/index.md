## Drawer

抽屉组件:

### 何时使用

- 简单业务的增删改查中使用的抽屉组件

### 使用示例

```tsx
import React, { Fragment } from 'react';
import { CCDrawer, FormModeEnum } from 'easycc-rc-4';
import { Button, Divider, Input, Form, Row, Select, Spin } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';

const multipleEnum = {
  a: { text: '多选项0', status: 'Default' },
  b: { text: '多选项1', status: 'Processing' },
  c: { text: '多选项2', status: 'Success' },
  d: { text: '多选项3', status: 'Error' },
};

const record = {
  id: 1,
  dateRange: [1608711421789, 1608711421789],
  digit: 99,
  dtCreaDateTime: 1608711421789,
  dtUpdateDateTime: 1608711421789,
  multiple: ['a', 'c'],
  password: '123456',
  select: '1',
  switch: false,
  textarea: '这是一段文字',
  uploadFile: [
    {
      id: '1',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ],
  username: '用户名',
  selectSearch: [],
};

const Index = () => {
  const columns: CCColumns<TestInterface>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      tooltip: '用户名',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '用户名为必填项',
          },
        ],
      },
      render: (dom, entity) => (
        <CCDrawer
          formmode={FormModeEnum.view}
          columns={columns}
          record={entity}
          descriptionsProps={{
            columns: columns.slice(1, columns.length),
          }}
        >
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
        element: <Input placeholder="请输入用户名" />,
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
      renderText: (val) =>
        val ? val.map((item: string) => multipleEnum[item].text).join(',') : '',
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
      search: false,
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
      render: () => '选择的联系人',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => (
        <Fragment>
          <CCDrawer
            formmode={FormModeEnum.update}
            columns={columns}
            record={entity}
            onFinish={onFinish}
          >
            <a>修改</a>
          </CCDrawer>
          <Divider type="vertical" />
          <a>删除</a>
        </Fragment>
      ),
    },
  ];

  const onFinish = async (values) => {
    console.log('onFinish', values);
    return new Promise((resolve) => {
      resolve({
        success: true,
      });
    });
  };

  return (
    <div>
      <ProTable<TestInterface>
        columns={columns}
        toolBarRender={() => [
          <CCDrawer
            key="create"
            formmode={FormModeEnum.create}
            columns={columns}
            title="待办"
            onFinish={onFinish}
          >
            <Button type="primary">新建待办</Button>
          </CCDrawer>,
        ]}
        request={(params, sorter, filter) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ success: true, data: [{ ...record }] });
            }, 500);
          });
        }}
        onSubmit={(params) => console.log('查询', params)}
        rowKey="id"
      />
    </div>
  );
};

export default Index;
```

## API

### CCDrawer

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| columns | 表格列的配置描述，列描述数据对象，是 columns 中的一项，参考 `CCForm` 组件中的 `columns`。 | `CCColumns[]` |
| formmode | 抽屉中 Form 模式 | `FormModeEnum` |
| title | 抽屉标题 | `string` |
| onClose | 抽屉的 `关闭` 事件,在抽屉关闭时执行 |
| footer | 自定义 footer |
| onClickCallback | 抽屉打开按钮的点击事件，在抽屉打开时执行 |
| descriptionsProps | 当 formmode === `view` 时，查看模式下的 props,参考[ProDescriptions](https://procomponents.ant.design/components/descriptions) |
| bodyStyle | Drawer 的 bodyStyle | `css` | marginBottom: 24 |
| style | CCDrawer style | `css` | display: 'inline-block' |
| buttonText | 打开抽屉 Button 中的文字 | `string` | '打开' |
| onFinish | `编辑` 或 `新增` 模式的获取数据方法, 类型为 Promise 函数，需要调用后台 `接口`, 如果返回 `success: true`,则关闭抽屉 | `(values?: any) => Promise<any>` |
| record | 传入需要展示或编辑的`单条数据` |

### FormModeEnum

| 参数   | 说明     | 类型   | 默认值   |
| ------ | -------- | ------ | -------- |
| create | 新建模式 | string | 'create' |
| view   | 查看模式 | string | 'view'   |
| update | 修改模式 | string | 'update' |
