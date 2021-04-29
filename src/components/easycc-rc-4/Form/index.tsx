import React, { Fragment } from 'react';
import {
  Col,
  Form,
  Divider,
  Select,
  Input,
  DatePicker,
  InputNumber,
  Switch,
  Upload,
  Button,
  Row,
  Popconfirm,
} from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import { FormInstance } from 'antd/lib/form';
import CCDrawer from '../Drawer';
import {
  LayoutInterface,
  FormItemLayoutInterface,
  CCColumns,
  modeType,
  FormModeEnum,
} from '../interface';
import { isEmpty, useForceUpdate } from '../utils';
import PickerWithType from './PickerWithType';

interface CCFormProps {
  columns?: CCColumns<any>[];
  colLayout?: LayoutInterface;
  formItemLayout?: FormItemLayoutInterface;
  record?: any;
  form?: FormInstance;
}

const valueTypeForDate = [
  'date',
  'dateWeek',
  'dateMonth',
  'dateQuarter',
  'dateYear',
  'dateTime',
  'time',
];
const valueTypeForDateRange = ['dateRange', 'dateTimeRange'];

const CCForm: React.FC<CCFormProps> = ({
  columns = [],
  colLayout = { span: 24 },
  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  },
  record,
  form,
}) => {
  const forceUpdate = useForceUpdate();
  const onCreate = async (values: any, key: string) => {
    return new Promise((resolve) => {
      const oldRecord = form?.getFieldValue(key) || [];
      const newRecord = [
        {
          rId: Date.now(),
          ...values,
        },
      ].concat(oldRecord);
      form?.setFieldsValue({
        [key]: newRecord,
      });
      forceUpdate();
      resolve({ success: true });
    });
  };

  const onUpdate = async (values: any, key: string, entity: any) => {
    return new Promise((resolve) => {
      const oldRecord = form?.getFieldValue(key);
      let newRecord = [];
      if (oldRecord && oldRecord.length > 0) {
        newRecord = oldRecord.map((item: any) => {
          if (item.id === entity.id) {
            return {
              ...entity,
              ...values,
            };
          } else {
            return item;
          }
        });
      }
      form?.setFieldsValue({
        [key]: newRecord,
      });
      forceUpdate();
      resolve({ success: true });
    });
  };

  const onDelete = (entity: any, key: string) => {
    const oldRecord = form?.getFieldValue(key) || [];
    const newRecord = oldRecord.filter((item: any) => {
      return entity.rId ? item.rId !== entity.rId : item.id !== entity.id;
    });
    form?.setFieldsValue({
      [key]: newRecord,
    });
    forceUpdate();
  };

  const renderFormItems = () => {
    if (columns && columns.length > 0) {
      const formItems = columns
        .filter((column) => column && !column.hideInForm && column.dataIndex !== 'option')
        .map((item: any) => {
          const newColLayout = {
            ...colLayout,
            ...item.formItem?.colLayout,
          };
          const newFormItemLayout = {
            ...formItemLayout,
            ...item.formItem?.formItemLayout,
          };

          let initialValue = null;
          if (record && get(record, String(item.dataIndex))) {
            initialValue = get(record, String(item.dataIndex));
          }

          const rules = item.formItem?.props?.rules || item.formItemProps?.rules;

          if (item.valueType === 'text') {
            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  tooltip={item.tooltip}
                  rules={rules}
                  initialValue={initialValue}
                >
                  <Input allowClear placeholder={item?.formItem?.props?.placeholder} />
                </Form.Item>
              </Col>
            );
          }

          if (item.formItem?.props?.eltype === 'upload') {
            const fileList = !isEmpty(initialValue)
              ? initialValue.map((file: any, index: number) => {
                  let name = '';
                  if (
                    item.formItem?.props?.fileNameKey &&
                    file[item.formItem?.props?.fileNameKey]
                  ) {
                    name = file[item.formItem?.props?.fileNameKey];
                  } else if (!isEmpty(file.filename)) {
                    name = file.filename;
                  } else {
                    name = `文件${index + 1}`;
                  }
                  return {
                    ...file,
                    uid: `${file.id}` || index,
                    name,
                    status: 'done',
                  };
                })
              : [];

            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  {...item.formItem.props}
                  rules={rules}
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    // console.log('Upload event:', e);
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e && e.fileList;
                  }}
                  initialValue={fileList}
                  tooltip={item.tooltip}
                >
                  <Upload
                    name={item.dataIndex ? `${item.dataIndex}` : 'file'}
                    action={item.formItem?.props?.action || ''}
                    listType={item.formItem?.props?.listType || 'text'}
                    multiple={item.formItem?.props?.multiple}
                    accept={item.formItem?.props?.accept}
                    {...item.formItem.props}
                  >
                    {item.formItem?.props?.children || <Button>上传文件</Button>}
                  </Upload>
                </Form.Item>
              </Col>
            );
          }

          if (item.formItem?.props?.eltype === 'switch') {
            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  valuePropName="checked"
                  initialValue={!isEmpty(initialValue) ? initialValue : true}
                >
                  <Switch />
                </Form.Item>
              </Col>
            );
          }

          if (item.valueType === 'digit') {
            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={!isEmpty(Number(initialValue)) ? Number(initialValue) : null}
                >
                  <InputNumber style={{ width: '100%' }} {...item.formItem?.props} />
                </Form.Item>
              </Col>
            );
          }

          if (item.valueType && valueTypeForDateRange.includes(item.valueType as string)) {
            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={
                    !isEmpty(initialValue) && initialValue.length > 0
                      ? [moment(initialValue[0]), moment(initialValue[1])]
                      : []
                  }
                >
                  <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    showTime={item.valueType === 'dateTimeRange'}
                  />
                </Form.Item>
              </Col>
            );
          }

          if (item.valueType && valueTypeForDate.includes(item.valueType as string)) {
            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={!isEmpty(initialValue) ? moment(initialValue) : null}
                >
                  <PickerWithType type={item.valueType} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            );
          }
          if (item.valueType === 'textarea') {
            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={initialValue}
                >
                  <Input.TextArea
                    allowClear
                    autoSize
                    maxLength={200}
                    showCount
                    {...item.formItem?.props}
                  />
                </Form.Item>
              </Col>
            );
          }

          if (item.valueEnum && Object.keys(item.valueEnum).length > 0) {
            const selectKeys = Object.keys(item.valueEnum);
            // eslint-disable-next-line
            let mode: modeType = undefined;
            if (
              item?.fieldProps?.mode === 'multiple' ||
              item?.formItem?.props?.mode === 'multiple'
            ) {
              mode = 'multiple';
            }

            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={initialValue || []}
                >
                  <Select
                    mode={mode}
                    placeholder={item.formItem?.props?.placeholder}
                    onChange={item.formItem?.props?.onChange}
                  >
                    {selectKeys.map((value) => {
                      return (
                        <Select.Option value={value} key={value}>
                          {item.valueEnum?.[value].text}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            );
          }

          if (item.formItem?.eltype === 'selectSearch') {
            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={initialValue || []}
                >
                  {React.cloneElement(item.formItem?.element, {
                    ...item.formItemProps,
                    ...item.formItem.props,
                  })}
                </Form.Item>
              </Col>
            );
          }

          if (item.formItem?.props?.eltype === 'table') {
            let dataSource = [];
            if (
              form?.getFieldValue(item.dataIndex)
              // &&
              // form?.getFieldValue(item.dataIndex).length > 0
            ) {
              dataSource = form?.getFieldValue(item.dataIndex)
                ? form?.getFieldValue(item.dataIndex)
                : [];
            }
            //  else if (record && record[item.dataIndex] && record[item.dataIndex].length > 0) {
            //   dataSource = record[item.dataIndex];
            // }

            const cols: CCColumns<any>[] = item.formItem?.props?.hideOption
              ? item.formItem?.props?.columns
              : item.formItem?.props?.columns.concat({
                  title: '操作',
                  dataIndex: 'option',
                  valueType: 'option',
                  render: (_: any, entity: any) => (
                    <Fragment>
                      <CCDrawer
                        formmode={FormModeEnum.update}
                        columns={item.formItem?.props?.columns}
                        record={entity}
                        onFinish={(values) => onUpdate(values, item.dataIndex, entity)}
                        confirm={false}
                      >
                        <a>修改</a>
                      </CCDrawer>
                      <Divider type="vertical" />
                      <Popconfirm
                        title="确认删除?"
                        onConfirm={() => onDelete(entity, item.dataIndex)}
                      >
                        <a>删除</a>
                      </Popconfirm>
                    </Fragment>
                  ),
                });

            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={item.formItem?.props?.rules}
                  initialValue={initialValue || []}
                >
                  <ProTable<any>
                    columns={cols || []}
                    search={false}
                    options={false}
                    size="small"
                    rowKey={(r) => r.rId || r.id}
                    dataSource={dataSource}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    toolBarRender={() => [
                      <CCDrawer
                        key="create"
                        formmode={FormModeEnum.create}
                        columns={item.formItem?.props?.columns}
                        title={item.formItem?.props?.title || ''}
                        onFinish={(values) => onCreate(values, item.dataIndex)}
                        confirm={false}
                      >
                        <Button type="primary">新建</Button>
                      </CCDrawer>,
                    ]}
                  />
                </Form.Item>
              </Col>
            );
          }

          if (item.formItem && item.formItem.element) {
            return (
              <Col key={item.dataIndex} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={initialValue || item.initialValue}
                >
                  {React.cloneElement(item.formItem?.element, {
                    ...item.formItemProps,
                    ...item.formItem.props,
                    ...item.formItem?.element.props,
                  })}
                </Form.Item>
              </Col>
            );
          }

          return null;
        });
      return formItems;
    }
    return null;
  };

  return <Row>{renderFormItems()}</Row>;
};

export default CCForm;
