import React, { useRef, useEffect, useState, Fragment } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { connect } from 'dva';
import { OrganizationEntity } from '../organization/data';
import {
  getAllUserService,
  getOrganizationService,
  getRoleService,
  addUserService,
  updateUserService,
  deleteUserService,
  resetPasswordService,
} from '@/services/setting/user';
import { CCDrawer, FormModeEnum } from 'easycc-rc-4';
import { CurrentUser } from '@/models/user';
import type { CCColumns } from 'easycc-rc-4';
import { TreeSelect, Select, Popconfirm, Divider, Switch, Tag, message } from 'antd';
import { ConnectState } from '@/models/connect';
import { getDicByDicName } from '@/utils/utils';
import { UserEntity } from './data';

interface UserProps {
  currentUser: CurrentUser;
}
const User: React.FC<UserProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [organization, setOrganization] = useState<OrganizationEntity[]>([]);
  const [userTypeEnum, setUserTypeEnum] = useState({});
  const [role, setRole] = useState<[]>([]);
  const [formmode, setFormmode] = useState(FormModeEnum.view);
  const { currentUser } = props;
  const initOrganization = () => {
    getOrganizationService({ current: 1, pageSize: 99999 }).then((res) => {
      if (res.success) {
        setOrganization(res.data);
      }
    });
  };

  const initRole = () => {
    getRoleService({ current: 1, pageSize: 99999 }).then((res) => {
      if (res.success) {
        setRole(res.data);
      }
    });
  };

  const initUserType = async () => {
    const userTypeEnumResult = await getDicByDicName('user_type');
    setUserTypeEnum(userTypeEnumResult);
  };

  useEffect(() => {
    initOrganization();
    initRole();
    initUserType();
  }, []);

  const onDelete = async (id: number) => {
    return deleteUserService(id).then((res) => {
      if (res.success) {
        actionRef.current?.reload();
      }
    });
  };

  const onChangeSatus = (check: boolean, oldValues: UserEntity) => {
    const updateValues: UserEntity = {
      ...oldValues,
      isUse: check ? 1 : 0,
    };
    return updateUserService(updateValues).then((res) => {
      if (res.success) {
        actionRef.current?.reload();
      }
    });
  };

  const onSubmit = async (values: UserEntity, formMode: FormModeEnum, oldValues?: UserEntity) => {
    if (formMode === FormModeEnum.create) {
      const { gender } = values;
      const addValues: UserEntity = {
        ...values,
        gender: gender.length > 0 ? gender : '',
      };
      return addUserService(addValues).then((res) => {
        if (res.success) {
          actionRef.current?.reload();
        }
        return res;
      });
    } else {
      const { gender } = values;
      const updateValues: UserEntity = {
        ...oldValues,
        ...values,
        gender: gender.length > 0 ? gender : '',
      };
      return updateUserService(updateValues).then((res) => {
        if (res.success) {
          actionRef.current?.reload();
        }
        return res;
      });
    }
  };

  const initTreeSelect = (data: any[]) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeSelect.TreeNode
            title={item.organizationName}
            datafeg={item}
            id={item.id}
            value={item.id}
          >
            {initTreeSelect(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return (
        <TreeSelect.TreeNode
          title={item.organizationName}
          key={item.id}
          datafeg={item}
          id={item.id}
          value={item.id}
        ></TreeSelect.TreeNode>
      );
    });

  const initSelect = (data: any[]) =>
    data.map((item) => {
      return (
        <Select.Option key={item.id} value={item.id} title={item.roleName}>
          {item.roleName}
        </Select.Option>
      );
    });

  const onResetPassword = (id: number) => {
    resetPasswordService(id).then((res) => {
      if (res.success) {
        message.success('??????????????????');
      }
    });
  };

  const columns: CCColumns<UserEntity>[] = [
    {
      title: '????????????',
      dataIndex: 'loginName',
      valueType: 'text',
      render: (dom, entity) => (
        <CCDrawer
          columns={columns.slice(1, columns.length - 1)}
          formmode={FormModeEnum.view}
          descriptionsProps={{
            title: dom as string,
            request: async () => ({ data: entity }),
          }}
          onClickCallback={() => setFormmode(FormModeEnum.view)}
        >
          <a>{dom}</a>
        </CCDrawer>
      ),
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '?????????????????????',
            },
          ],
          disabled: formmode === FormModeEnum.update,
        },
      },
    },
    {
      title: '????????????',
      dataIndex: 'userName',
      valueType: 'text',
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '?????????????????????',
            },
          ],
        },
      },
    },
    {
      title: '????????????',
      dataIndex: 'organizationId',
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '?????????????????????',
            },
          ],
        },
        element: <TreeSelect>{initTreeSelect(organization)}</TreeSelect>,
      },
      search: false,
      // editable: false,
      render: (dom, entity) => {
        return entity ? entity.organizationName : '';
      },
    },
    {
      title: '????????????',
      dataIndex: 'userRoles',
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '?????????????????????',
            },
          ],
        },
        element: <Select mode="multiple">{initSelect(role)}</Select>,
      },
      search: false,
      render: (dom, entity) =>
        entity.roleDtos.map((item: any) => (
          <Tag key={item.id} color="blue">
            {item.roleName}
          </Tag>
        )),
    },
    {
      title: '????????????',
      dataIndex: 'userType',
      valueEnum: userTypeEnum,
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '?????????????????????',
            },
          ],
        },
      },
    },
    {
      title: '??????',
      dataIndex: 'gender',
      valueEnum: {
        0: { text: '???', status: '0' },
        1: { text: '???', status: '1' },
      },
      search: false,
    },
    {
      title: '??????',
      dataIndex: 'phone',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: '????????????????????????',
          },
        ],
      },
      search: false,
    },
    {
      title: '??????',
      dataIndex: 'tax',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            pattern: /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/,
            message: '????????????????????????',
          },
        ],
      },
      search: false,
      hideInTable: true,
    },
    {
      title: '?????????',
      dataIndex: 'card',
      valueType: 'text',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '????????????????????????',
          },
        ],
      },
      search: false,
    },
    {
      title: '??????',
      dataIndex: 'mail',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '????????????????????????',
          },
        ],
      },
      search: false,
      hideInTable: true,
    },
    {
      title: '??????/??????',
      dataIndex: 'isUse',
      search: false,
      render: (dom, entity) => (
        <Switch
          defaultChecked={entity.isUse === 1}
          disabled={currentUser.loginName === entity.loginName}
          onChange={(values) => onChangeSatus(values, entity)}
        />
      ),
    },
    {
      title: '??????',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, entity: UserEntity) => {
        return (
          <Fragment>
            <CCDrawer
              title="??????"
              formmode={FormModeEnum.update}
              columns={columns}
              record={entity}
              onFinish={(values) => onSubmit(values, FormModeEnum.update, entity)}
              onClickCallback={() => setFormmode(FormModeEnum.update)}
            >
              <a>??????</a>
            </CCDrawer>
            <Divider type="vertical" />
            <Popconfirm title="?????????????" onConfirm={() => onDelete(entity.id)}>
              <a>??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="???????????????????" onConfirm={() => onResetPassword(entity.id)}>
              <a>????????????</a>
            </Popconfirm>
          </Fragment>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<UserEntity>
        headerTitle=""
        columns={columns}
        actionRef={actionRef}
        request={(params, sorter, filter) => getAllUserService({ ...params, sorter, filter })}
        rowKey="id"
        toolBarRender={() => [
          <CCDrawer
            buttonText="??????"
            title="??????"
            columns={columns}
            formmode={FormModeEnum.create}
            onFinish={(values) => onSubmit(values, FormModeEnum.create)}
            onClickCallback={() => setFormmode(FormModeEnum.create)}
          ></CCDrawer>,
        ]}
      />
    </PageContainer>
  );
};

export default connect(({ user }: ConnectState) => ({
  ...user,
}))(User as any);
