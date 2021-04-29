import React, { useState, Fragment, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Form, Divider, Popconfirm } from 'antd';
import { CCColumns, CCDrawer, FormModeEnum, CCProTable } from 'easycc-rc-4';
import { DicEntity } from './data';
import {
  getAllDicService,
  createDicService,
  deleteDicService,
  updateDicService,
} from '@/services/setting/dic';

const Dic = () => {
  const [record, setRecord] = useState<DicEntity | null>(null);
  const [formMode, setFormMode] = useState<FormModeEnum>(FormModeEnum.view);
  const [, setDataSource] = useState<DicEntity[]>([]);

  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const onCreate = async (values: DicEntity) => {
    return createDicService(values).then((res) => {
      if (res.success) {
        actionRef.current?.reload();
      }
      return res;
    });
  };

  const onUpdate = async (values: DicEntity) => {
    return updateDicService({ ...record, ...values }).then((res) => {
      if (res.success) {
        setRecord(null);
        actionRef.current?.reload();
      }
      return res;
    });
  };

  const onDelete = async (id: number) => {
    const res = await deleteDicService(id);
    if (res.success) {
      actionRef.current?.reload();
    }
  };

  const dicTableColumns: CCColumns<DicEntity>[] = [
    {
      title: '名称',
      dataIndex: 'dictName',
      valueType: 'text',
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '请输入名称',
            },
            () => ({
              validator(_, value) {
                const validatorData: DicEntity[] = form.getFieldValue('sysDictDto')
                  ? form.getFieldValue('sysDictDto')
                  : [];
                if (!value || !validatorData.find((item) => item.dictName === value)) {
                  return Promise.resolve();
                }
                return Promise.reject('该名称已存在');
              },
            }),
          ],
        },
      },
    },
    {
      title: '值',
      dataIndex: 'dictNo',
      valueType: 'text',
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '请输入值',
            },
            () => ({
              validator(_, value) {
                const validatorData: DicEntity[] = form.getFieldValue('sysDictDto')
                  ? form.getFieldValue('sysDictDto')
                  : [];
                if (!value || !validatorData.find((item) => item.dictNo === value)) {
                  return Promise.resolve();
                }
                return Promise.reject('该值已存在');
              },
            }),
          ],
        },
      },
    },
  ];

  const columns: CCColumns<DicEntity>[] = [
    {
      title: '字典编号',
      valueType: 'text',
      dataIndex: 'groupNo',
      formItem: {
        props: {
          disabled: formMode === FormModeEnum.update,
          rules: [
            {
              required: true,
              message: '请输入字典编号',
            },
          ],
        },
      },
      render: (dom, entity) => {
        return (
          <CCDrawer
            columns={columns.slice(1, columns.length - 1)}
            formmode={FormModeEnum.view}
            record={entity}
            propsForm={form}
            descriptionsProps={{
              title: entity.groupName || '',
              request: async () => ({ data: entity }),
              column: 1,
            }}
          >
            <a>{dom}</a>
          </CCDrawer>
        );
      },
    },
    {
      title: '字典名称',
      valueType: 'text',
      dataIndex: 'groupName',
      formItem: {
        props: {
          rules: [
            {
              required: true,
              message: '请输入字典名称',
            },
          ],
        },
      },
    },
    {
      title: '字典内容',
      dataIndex: 'sysDictDto',
      hideInTable: true,
      search: false,
      formItem: {
        props: {
          eltype: 'table',
          columns: dicTableColumns,
          title: '字典',
          rules: [
            {
              required: true,
              message: '请输入字典内容',
            },
          ],
        },
      },
      render: (dom: any) => {
        if (dom && dom.length > 0) {
          return (
            <CCProTable
              rowKey="id"
              search={false}
              style={{ width: '100%' }}
              options={false}
              pagination={false}
              columns={dicTableColumns}
              dataSource={dom}
              toolBarRender={false}
            />
          );
        }
        return null;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, entity: DicEntity) => (
        <Fragment>
          <CCDrawer
            formmode={FormModeEnum.update}
            columns={columns}
            record={entity}
            onFinish={onUpdate}
            propsForm={form}
            onClickCallback={() => {
              setFormMode(FormModeEnum.update);
              setRecord(entity);
              form.setFieldsValue({
                ...entity,
              });
            }}
            title="字典"
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
      <CCProTable
        columns={columns}
        actionRef={actionRef}
        request={(params) =>
          getAllDicService(params).then((res) => {
            setDataSource(res.data);
            return res;
          })
        }
        toolBarRender={() => [
          <CCDrawer
            key="create"
            formmode={FormModeEnum.create}
            columns={columns}
            title="字典"
            onFinish={onCreate}
            propsForm={form}
            onClickCallback={() => {
              setFormMode(FormModeEnum.create);
              form.resetFields();
            }}
          >
            <Button type="primary">新建字典</Button>
          </CCDrawer>,
        ]}
        rowKey="id"
      />
    </PageContainer>
  );
};

export default Dic;
