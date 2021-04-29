import React, { CSSProperties, ReactNode, useState, useRef } from 'react';
import ProTable, { ActionType, ProColumns, RequestData } from '@ant-design/pro-table';
import { Button, Tree, Row, Col } from 'antd';
import { CCColumns } from '../interface';
import CCModal from '../Modal';
// import { treeData } from './data'
import { TablePagination } from '../interface';
import './index.less';
import { SortOrder } from 'antd/lib/table/interface';

interface CCModalTableProps {
  column?: number;
  style?: CSSProperties;
  buttonText?: string;
  title?: string;
  onFinish?: (rowKyes?: any, ...args: any[]) => void;
  onClose?: () => void;
  footer?: ReactNode;
  cancelText?: string;
  okText?: string;
  content?: ReactNode;
  width?: number;
  bodyStyle?: CSSProperties;
  request?: (
    params: any & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
    sort: {
      [key: string]: SortOrder;
    },
    filter: {
      [key: string]: React.ReactText[];
    },
  ) => Promise<RequestData<any>>;
  columns?: CCColumns<any>[] & ProColumns<any>[];
  pagination?: TablePagination;
  defaultExpandAll?: boolean;
  defaultSelectedTreeKeys?: string[];
  tableParams?: any;
  onSelectTreeKeys?: (values: any, info: any, actionRef: any) => void;
  treeData?: any[];
  rowKey?: string;
}

const Index: React.FC<CCModalTableProps> = (props) => {
  const {
    column = 2,
    title = 'ModalTable 标题',
    onFinish,
    cancelText = '关闭',
    okText = '确定',
    content,
    width = 650,
    bodyStyle = {
      minHeight: 450,
    },
    request,
    columns = [],
    pagination = { pageSize: 10, showTotal: () => null },
    defaultExpandAll = true,
    tableParams,
    onSelectTreeKeys,
    treeData,
    rowKey = 'id',
  } = props;

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [rowKeys, setRowKeys] = useState<string[] | number[]>([]);

  const actionRef = useRef<ActionType>();

  const renderTable = () => {
    return (
      <ProTable<any>
        size="small"
        actionRef={actionRef}
        className="container"
        params={{
          pageSize: 99999,
          ...tableParams,
        }}
        columns={columns}
        request={request}
        rowKey={rowKey}
        pagination={pagination}
        toolBarRender={false}
        rowSelection={{
          onChange: (selectRowKeys, info) => {
            setRowKeys(selectRowKeys as any);
            setRows(info);
          },
        }}
      />
    );
  };

  const onSelect = (keys: any, info: any) => {
    if (keys && keys.length > 0) {
      if (onSelectTreeKeys) {
        onSelectTreeKeys(keys, info, actionRef);
      }
      setSelectedKeys(keys);
    }
  };

  const renderTree = () => {
    return (
      <div>
        <Tree
          defaultExpandAll={defaultExpandAll}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={treeData}
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <Row>
        <Col span={column === 2 ? 6 : 0}>{renderTree()}</Col>
        <Col span={column === 2 ? 18 : 24}>{renderTable()}</Col>
      </Row>
    );
  };

  const onSubmit = async () => {
    if (onFinish) {
      return new Promise((resolve) => {
        onFinish(rowKeys, rows);
        return resolve({
          success: true,
        });
      });
    }
    return null;
  };

  return (
    <CCModal
      modalStyle={{ top: 10 }}
      title={title}
      content={content || renderContent()}
      bodyStyle={bodyStyle}
      width={width}
      cancelText={cancelText}
      okText={okText}
      destroyOnClose
      onFinish={onSubmit}
    >
      <Button>选择联系人</Button>
    </CCModal>
  );
};

export default Index;
