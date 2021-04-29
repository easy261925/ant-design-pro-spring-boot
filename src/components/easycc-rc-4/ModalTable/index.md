## Modal-table

Demo:

主要用于选择联系人时使用

```tsx
import React, { useState } from 'react';
import { CCModalTable, CCColumns } from 'easycc-rc-4';
import { tableListDataSource, treeData } from './data';

const Index = () => {
  const [tableParams, setTableParams] = useState({});

  const request = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: tableListDataSource,
          success: true,
          total: tableListDataSource.length,
        });
      }, 500);
    });
  };

  const columns: CCColumns<Member>[] = [
    {
      dataIndex: 'nickName',
      title: '成员名称',
    },
    {
      dataIndex: 'email',
      title: '账号',
    },
    {
      dataIndex: 'phone',
      title: '手机号',
      search: false,
    },
    {
      dataIndex: 'permission',
      title: '权限范围',
      search: false,
      render: (_, record) => {
        const { role, permission = [] } = record;
        if (role === 'admin') {
          return '所有权限';
        }
        return permission && permission.length > 0 ? permission.join('、') : '无';
      },
    },
  ];

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

  return (
    <CCModalTable
      title="选择联系人"
      request={request}
      columns={columns}
      onSelectTreeKeys={onSelectTreeKeys}
      onFinish={selectOnFinish}
      treeData={treeData}
      tableParams={tableParams}
    ></CCModalTable>
  );
};

export default Index;
```
