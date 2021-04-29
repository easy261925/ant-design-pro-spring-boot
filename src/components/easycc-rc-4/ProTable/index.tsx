import React, { useRef } from 'react';
import ProTable, { ProTableProps } from '@ant-design/pro-table';
import type { CCColumns } from '../interface';
import type { ActionType } from '@ant-design/pro-table';
import { ToolBarProps } from '@ant-design/pro-table/lib/components/ToolBar';

interface CCProTableProps extends ProTableProps<any, any> {
  columns?: CCColumns<any>[] | any;
  rowKey?: string;
  /**
   * @name 渲染操作栏
   */
  toolBarRender?: ToolBarProps<any>['toolBarRender'] | false;
}

const CCProTable: React.FC<CCProTableProps> = (props) => {
  const { columns } = props;
  const actionRef = useRef<ActionType>();

  const cols: CCColumns<any>[] = [
    {
      title: '用户名',
      valueType: 'text',
      dataIndex: 'username',
    },
  ];

  return (
    <ProTable
      columns={columns || cols}
      actionRef={actionRef}
      rowKey="id"
      params={{ pageSize: 10 }}
      pagination={{ pageSize: 10 }}
      toolBarRender={() => [<div>这里是工具栏</div>]}
      {...props}
    />
  );
};

export default CCProTable;
