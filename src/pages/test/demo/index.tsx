import React, { Fragment, useState, useCallback, useEffect } from 'react';
import type { CCColumns } from 'easycc-rc-4';
import { CCDrawer, FormModeEnum, CCModalTable, CCProTable } from 'easycc-rc-4';
import type { ProColumns } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Divider, Popconfirm, Select, Spin } from 'antd';
import type { TestInterface } from './data';
import { getAllService } from './service';
import { treeData, userColumns } from './mock';
import debounce from 'lodash/debounce';

const Index = () => {
  // CCModalTable 中参数
  const [tableParams, setTableParams] = useState({});
  // 选择联系人中 loading
  const [fetching, setFetching] = useState(false);
  const [userDataSource, setUserDataSource] = useState<TestInterface[]>([]);

  const getAllUser = () => {
    getAllService({ current: 1, pageSize: 99999 })
      .then((res) => {
        setUserDataSource(res.data);
        setFetching(false);
      })
      .catch(() => {
        setFetching(false);
      });
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const onCreate = async (values: TestInterface) => {
    console.log('onCreate', values);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
        console.log('onCreate - ok');
      }, 2000);
    });
  };

  const onSave = async (values: TestInterface) => {
    console.log('onSave', values);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
        console.log('onSave - ok');
      }, 2000);
    });
  };

  const onUpdate = async (values: TestInterface) => {
    console.log('onUpdate', values);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 2000);
    });
  };

  const onSelectTreeKeys = (values: string[], info: any, actionRef: any) => {
    setTableParams({
      orgId: values[0],
    });
    if (actionRef && actionRef.current) {
      actionRef.current.reload();
    }
  };

  const selectOnFinish = (rowKeys: any, rows: any) => {
    console.log('rowKeys', rowKeys);
    console.log('rows', rows);
  };

  // 防抖函数
  const debouncedSave = useCallback(
    debounce((nextValue) => {
      setFetching(true);
      getAllService({
        username: nextValue,
      })
        .then((res) => {
          setUserDataSource(res.data);
          setFetching(false);
        })
        .catch(() => {
          setFetching(false);
        });
    }, 800),
    [],
  );

  const columns: CCColumns<TestInterface>[] & ProColumns<TestInterface>[] = [
    {
      title: '选择联系人',
      dataIndex: 'selectUser',
      formItem: {
        eltype: 'selectSearch',
        element: (
          <Select
            mode="multiple"
            placeholder="请选择联系人"
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={debouncedSave}
            style={{ width: '100%' }}
          >
            {userDataSource.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.username}
              </Select.Option>
            ))}
          </Select>
        ),
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      tooltip: '用户名',
      valueType: 'text',
      formItem: {
        props: {
          placeholder: '请输入待办事项',
          rules: [
            {
              required: true,
              message: '请输入待办事项',
            },
          ],
        },
      },
      render: (val: any, entity: TestInterface) => {
        return (
          <CCDrawer formmode={FormModeEnum.view} columns={columns} record={entity}>
            <a>{val}</a>
          </CCDrawer>
        );
      },
    },
    {
      title: '单选',
      dataIndex: 'select',
      valueEnum: {
        0: { text: '选项一' },
        1: { text: '选项二' },
        2: { text: '选项三' },
        3: { text: '选项四' },
      },
    },
    {
      title: '多行文本',
      dataIndex: 'textarea',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '多选',
      dataIndex: 'multiple',
      fieldProps: {
        mode: 'multiple',
      },
      valueEnum: {
        a: { text: '多选项0' },
        b: { text: '多选项1' },
        c: { text: '多选项2' },
        d: { text: '多选项3' },
      },
      // renderText: (val: any) =>
      //   val.map(
      //     (item: string) =>
      //       ({
      //         a: { text: '多选项0' },
      //         b: { text: '多选项1' },
      //         c: { text: '多选项2' },
      //         d: { text: '多选项3' },
      //       }[item].text),
      //   ),
    },

    {
      title: '创建时间',
      dataIndex: 'dtCreaDateTime',
      valueType: 'date',
    },
    {
      title: '时间范围',
      dataIndex: 'dateRange',
      valueType: 'dateRange',
    },
    {
      title: '数字',
      dataIndex: 'digit',
      search: false,
      valueType: 'digit',
    },
    {
      title: '切换',
      dataIndex: 'switch',
      search: false,
      formItem: {
        props: { eltype: 'switch' },
      },
      renderText: (val: any) => (val ? '选中' : '未选中'),
    },
    {
      title: '附件',
      dataIndex: 'uploadFile',
      search: false,
      formItem: {
        props: {
          eltype: 'upload',
        },
      },
      render: (val: any, entity: TestInterface) => {
        if (entity.uploadFile && entity.uploadFile.length > 0) {
          return entity.uploadFile.map(
            (file: { url: string | undefined; id: React.Key | null | undefined }) => {
              return <img alt="" src={file.url} key={file.id} style={{ width: 40 }} />;
            },
          );
        }
        return null;
      },
    },
    {
      title: '选择联系人ModalTable',
      hideInTable: true,
      dataIndex: 'person',
      formItem: {
        element: (
          <CCModalTable
            key="m"
            title="选择联系人"
            columns={userColumns}
            treeData={treeData}
            request={(params, sorter, filter) => getAllService({ ...params, sorter, filter })}
            onSelectTreeKeys={onSelectTreeKeys}
            tableParams={tableParams}
            onFinish={selectOnFinish}
          />
        ),
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, entity: TestInterface) => (
        <Fragment>
          <CCDrawer
            formmode={FormModeEnum.update}
            columns={columns}
            record={entity}
            onFinish={onUpdate}
            confirm={false}
          >
            <a>修改</a>
          </CCDrawer>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              console.log('确认删除', entity);
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  return (
    <PageContainer>
      <CCProTable
        columns={columns}
        toolBarRender={() => [
          <CCDrawer
            key="create"
            formmode={FormModeEnum.create}
            columns={columns}
            title="待办"
            onFinish={onCreate}
            saveButton
            saveRequest={onSave}
          >
            <Button type="primary">新建待办</Button>
          </CCDrawer>,
        ]}
        request={(params, sorter, filter) => getAllService({ ...params, sorter, filter })}
        onSubmit={(params) => console.log('查询', params)}
        rowKey="id"
      />
    </PageContainer>
  );
};

export default Index;
