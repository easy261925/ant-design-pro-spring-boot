import React, { Fragment, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import { Divider, Popconfirm, Switch } from 'antd';
import { CCDrawer, CCColumns, CCProTable, FormModeEnum } from 'easycc-rc-4';
import { OrganizationEntity } from './data';
import {
  getAllService,
  addOrganizationService,
  updateOrganizationService,
  deleteOrganizationService,
} from './service';

const Organization = () => {
  const actionRef = useRef<ActionType>();

  const onDelete = (id: number) => {
    return deleteOrganizationService(id).then((res) => {
      if (res.success) {
        actionRef.current?.reload();
      }
    });
  };

  const isUseOnChange = (values: OrganizationEntity, value: boolean) => {
    const payload = {
      ...values,
      isUse: value ? 1 : 0,
    };
    return updateOrganizationService(payload).then((res) => {
      if (res.success) {
        actionRef.current?.reload();
      }
      return res;
    });
  };

  // 新增机构
  const onFinish = async (values: OrganizationEntity, formmode: FormModeEnum, id: number) => {
    if (formmode === 'create') {
      const payload: OrganizationEntity = {
        ...values,
        isUse: values.isUse ? 1 : 0,
        upId: id,
      };
      return addOrganizationService(payload).then((res) => {
        if (res.success) {
          actionRef.current?.reload();
        }
        return res;
      });
    } else {
      const payload: OrganizationEntity = {
        ...values,
        isUse: values.isUse ? 1 : 0,
        id,
      };
      return updateOrganizationService(payload).then((res) => {
        if (res.success) {
          actionRef.current?.reload();
        }
        return res;
      });
    }
  };

  const columns: CCColumns<OrganizationEntity>[] = [
    {
      title: '机构名称',
      valueType: 'text',
      dataIndex: 'organizationName',
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '请输入机构名称',
            },
          ],
        },
      },
      render: (dom, entity) => (
        <CCDrawer
          formmode={FormModeEnum.view}
          columns={columns}
          record={entity}
          descriptionsProps={{ title: dom as string }}
        >
          <a>{dom}</a>
        </CCDrawer>
      ),
    },

    {
      title: '机构统一编码',
      valueType: 'text',
      dataIndex: 'organizationNo',
      search: false,
      hideInTable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
      valueType: 'text',
      tooltip: '格式为 xxx@xxx.com',
      hideInTable: false,
      search: false,
      formItem: {
        colLayout: { span: 12 },
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        props: {
          rules: [
            {
              type: 'email',
              message: '邮箱格式错误',
            },
          ],
        },
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      valueType: 'text',
      tooltip: '手机号码',
      search: false,
      formItem: {
        colLayout: { span: 12 },
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        props: {
          rules: [
            {
              pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
              message: '联系电话格式错误',
            },
          ],
        },
      },
    },
    {
      title: '座机',
      dataIndex: 'tax',
      valueType: 'text',
      tooltip: '座机号码',
      hideInTable: true,
      search: false,
      formItem: {
        colLayout: { span: 12 },
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        props: {
          rules: [
            {
              pattern: /^(?:\d{3}-)?\d{8}$|^(?:\d{4}-)?\d{7,8}$/,
              message: '座机号码格式错误',
            },
          ],
        },
      },
    },
    {
      title: '启用',
      dataIndex: 'isUse',
      search: false,
      formItem: {
        colLayout: { span: 12 },
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        props: {
          eltype: 'switch',
        },
      },
      render: (dom, values) => (
        <Switch defaultChecked={dom === 1} onChange={(value) => isUseOnChange(values, value)} />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (dom, entity) => {
        return (
          <Fragment>
            <CCDrawer
              formmode={FormModeEnum.create}
              columns={columns}
              onFinish={(values) => onFinish(values, FormModeEnum.create, entity.id)}
            >
              <a>新建子机构</a>
            </CCDrawer>
            <Divider type="vertical" />
            <CCDrawer
              formmode={FormModeEnum.update}
              columns={columns}
              record={entity}
              onFinish={(values) => onFinish(values, FormModeEnum.update, entity.id)}
            >
              <a>修改</a>
            </CCDrawer>
            <Divider type="vertical" />
            <Popconfirm title="确认删除?" onConfirm={() => onDelete(entity.id)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <CCProTable
        actionRef={actionRef}
        request={(params, sorter, filter) => getAllService({ ...params, sorter, filter })}
        columns={columns}
        toolBarRender={() => [
          <CCDrawer
            buttonText="新建机构"
            title="机构"
            formmode={FormModeEnum.create}
            columns={columns}
            onFinish={(values) => onFinish(values, FormModeEnum.create, 0)}
          />,
        ]}
      />
    </PageContainer>
  );
};

export default Organization;
