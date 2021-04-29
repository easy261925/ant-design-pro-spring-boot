import React, { Fragment, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import { Tree, Form, Divider, Popconfirm, Switch } from 'antd';
import { CurrentUser } from '@/models/user';
import { CCProTable, CCDrawer, CCColumns, FormModeEnum } from 'easycc-rc-4';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import {
  getAllRoleService,
  addRoleService,
  updateRoleService,
  deleteRoleService,
} from '@/services/setting/role';
import { RoleEntity } from './data';

interface RoleProps {
  routes: any[];
  currentUser: CurrentUser;
}

const Role: React.FC<RoleProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { routes } = props;
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const { currentUser } = props;
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

  const onCheck = (keys: any) => {
    setCheckedKeys(keys);
    setFieldsValue({
      roleRights: keys,
    });
  };

  const onChangeSatus = (check: boolean, oldValues: RoleEntity) => {
    const changeValue: RoleEntity = {
      ...oldValues,
      isUse: check ? 1 : 0,
    };
    return updateRoleService(changeValue).then((res) => {
      if (res.success) {
        actionRef.current?.reload();
      }
      return res;
    });
  };

  const onFinish = async (values: RoleEntity, formmode: FormModeEnum, oldValues?: RoleEntity) => {
    const { roleRights = [] } = values;
    const allRoleRightsArray = [];
    for (let i = 0; i < roleRights.length; i += 1) {
      const item = roleRights[i];
      if (item.split('/').length === 3) {
        allRoleRightsArray.push(`/${item.split('/')[1]}`);
        allRoleRightsArray.push(item);
      } else {
        allRoleRightsArray.push(item);
      }
    }
    const allRoleRights = Array.from(new Set(allRoleRightsArray));
    if (formmode === FormModeEnum.create) {
      const addValues: RoleEntity = {
        ...values,
        roleRights,
        authority: allRoleRights,
      };
      return addRoleService(addValues).then((res) => {
        if (res.success) {
          actionRef.current?.reload();
        }
        return res;
      });
    } else {
      const updateValues: RoleEntity = {
        ...oldValues,
        ...values,
        roleRights,
        authority: allRoleRights,
      };
      return updateRoleService(updateValues).then((res) => {
        if (res.success) {
          actionRef.current?.reload();
        }
        return res;
      });
    }
  };

  const onDelete = (id: number) => {
    return deleteRoleService(id).then((res) => {
      if (res.success) {
        actionRef.current?.reload();
      }
    });
  };

  const treeData = routes
    .find((route) => route.path === '/')
    ?.routes.find((item: { path: string }) => item.path === '/')
    .routes.filter((i: { name: any; hideInMenu: any }) => i.name && !i.hideInMenu);

  const renderTreeNodes = (data: any[]) => {
    if (data && data.length > 0) {
      return data.map((item) => {
        if (item.routes) {
          return (
            <Tree.TreeNode title={item.name} key={item.path}>
              {renderTreeNodes(item.routes)}
            </Tree.TreeNode>
          );
        }
        return <Tree.TreeNode title={item.name} key={item.path} />;
      });
    }
    return [];
  };

  const columns: CCColumns<RoleEntity>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      valueType: 'text',
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '请输入角色名称',
            },
          ],
        },
      },
      render: (dom, entity) => (
        <CCDrawer
          columns={columns.slice(1, columns.length - 1)}
          formmode={FormModeEnum.view}
          descriptionsProps={{
            title: dom as string,
            request: async () => ({ data: entity }),
            column: 1,
          }}
        >
          <a>{dom}</a>
        </CCDrawer>
      ),
    },
    {
      title: '角色描述',
      dataIndex: 'remark',
      valueType: 'textarea',
    },
    {
      title: '启用/停用',
      dataIndex: 'isUse',
      search: false,
      render: (dom, entity) => {
        return (
          <Switch
            defaultChecked={entity.isUse === 1}
            disabled={entity.roleNo === 'S0' || currentUser.userRoles?.includes(entity.id)}
            onChange={(values) => onChangeSatus(values, entity)}
          />
        );
      },
    },
    {
      title: '菜单权限',
      dataIndex: 'roleRights',
      hideInTable: true,
      search: false,
      formItem: {
        // props: {
        //   rules: [
        //     {
        //       required: true,
        //       message: '请选择菜单权限',
        //     },
        //   ],
        // },
        element: (
          <Tree checkable onCheck={onCheck} checkedKeys={checkedKeys} defaultExpandAll>
            {renderTreeNodes(treeData)}
          </Tree>
        ),
      },
      render: (dom, entity) => {
        return (
          <Tree
            checkable
            onCheck={onCheck}
            checkedKeys={entity.roleRights}
            disabled
            defaultExpandAll
          >
            {renderTreeNodes(treeData)}
          </Tree>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (dom, entity) => (
        <Fragment>
          <CCDrawer
            formmode={FormModeEnum.update}
            columns={columns}
            record={entity}
            onFinish={(values) => onFinish(values, FormModeEnum.update, entity)}
            propsForm={form}
            onClickCallback={() => {
              setFieldsValue({ ...entity });
              setCheckedKeys(entity.roleRights || []);
            }}
            title="角色"
          >
            <a>修改</a>
          </CCDrawer>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" onConfirm={() => onDelete(entity.id)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  return (
    <PageContainer>
      <Form form={form}></Form>
      <CCProTable
        columns={columns}
        actionRef={actionRef}
        request={(params, sorter, filter) => getAllRoleService({ ...params, sorter, filter })}
        toolBarRender={() => [
          <CCDrawer
            buttonText="新建角色"
            title="角色"
            formmode={FormModeEnum.create}
            columns={columns}
            propsForm={form}
            onFinish={(values) => onFinish(values, FormModeEnum.create)}
            onClickCallback={() => {
              form.resetFields();
              setCheckedKeys([]);
            }}
          />,
        ]}
      />
    </PageContainer>
  );
};

export default connect(({ user }: ConnectState) => ({
  ...user,
}))(Role as any);
