import React from 'react';
import { Table } from 'antd';

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const dataSource = [
    {
      key: '1',
      name: '张三',
      status: 0,
      content: '待办事项一',
    },
    {
      key: '2',
      name: '李四',
      status: 1,
      content: '待办事项二',
    },
  ];
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (dom: number) => {
        return dom === 0 ? '待办' : '已办';
      },
    },
    {
      title: '待办事项',
      dataIndex: 'content',
      key: 'content',
    },
  ];
  return (
    <div>
      <Table
        title={() => '展示报表'}
        dataSource={dataSource}
        columns={columns}
        size="small"
        pagination={false}
      />
    </div>
  );
};

export default TodoList;
