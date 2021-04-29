import React, { useState, ReactNode, Fragment, CSSProperties } from 'react';
import { Drawer, Button, Row, Form, Spin, Modal } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { FormModeEnum, FormModeLabelEnum } from '../interface';
import { DrawerProps } from 'antd/lib/drawer';
import { ProColumns } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less';
import CCForm from '../Form';
import { FormInstance } from 'antd/lib/form';

interface CCDrawerProps {
  propsVisible?: boolean;
  formmode?: FormModeEnum;
  title?: string;
  onClose?: () => void;
  footer?: ReactNode;
  loading?: boolean;
  onFinish?: (values?: any) => Promise<any>;
  columns?: ProColumns<any>[];
  record?: any;
  onClickCallback?: () => void;
  descriptionsProps?: {
    column?: number;
    title?: string;
    request?: (params: { [key: string]: any }) => Promise<any>;
    params?: Object;
    columns?: ProColumns<any>[];
  };
  bodyStyle?: CSSProperties;
  style?: CSSProperties;
  buttonText?: string;
  confirm?: boolean;
  confirmTitle?: string;
  confirmContent?: string;
  saveButton?: boolean;
  saveRequest?: (values?: any) => Promise<any>;
  propsForm?: FormInstance<any>;
}

const CCDrawer: React.FC<CCDrawerProps & DrawerProps> = (props) => {
  const {
    propsVisible,
    children,
    title = '抽屉',
    formmode,
    width = 650,
    placement,
    closable = true,
    onClose,
    onFinish,
    footer,
    loading,
    columns,
    record,
    destroyOnClose = true,
    onClickCallback,
    descriptionsProps,
    bodyStyle = { marginBottom: 24 },
    style,
    buttonText = '打开',
    confirm = true,
    confirmTitle = '确认提交?',
    confirmContent = '',
    saveButton = false,
    saveRequest,
    propsForm,
    ...ext
  } = props;
  const [visible, setVisible] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);

  const [form] = propsForm ? [propsForm] : Form.useForm();

  const onClosed = () => {
    if (formmode !== FormModeEnum.view) {
      form.resetFields();
    }
    if (onClose) {
      onClose();
      setVisible(false);
    } else {
      setVisible(false);
    }
  };

  const onSave = async () => {
    if (saveRequest) {
      form.validateFields().then((values: any) => {
        setStateLoading(true);
        saveRequest(values)
          .then((res) => {
            setStateLoading(false);
            setStateLoading(false);
            if (res.success) {
              form.resetFields();
              setVisible(false);
            }
          })
          .catch((err) => {
            setStateLoading(false);
            console.log('onSave Error', err);
          });
      });
    }
  };

  const onSubmit = async () => {
    form.validateFields().then((values) => {
      if (confirm) {
        Modal.confirm({
          title: confirmTitle,
          icon: <ExclamationCircleOutlined />,
          content: confirmContent,
          onOk() {
            if (!onFinish) {
              return;
            }
            setStateLoading(true);
            onFinish(values)
              .then((res) => {
                setStateLoading(false);
                if (res.success) {
                  if (formmode === FormModeEnum.create) {
                    form.resetFields();
                  }
                  setVisible(false);
                }
              })
              .catch((err) => {
                setStateLoading(false);
                console.log('onFinish Error', err);
              });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      } else {
        if (!onFinish) {
          return;
        }
        setStateLoading(true);
        onFinish(values)
          .then((res) => {
            setStateLoading(false);
            if (res.success) {
              form.resetFields();
              setVisible(false);
            }
          })
          .catch((err) => {
            setStateLoading(false);
            console.log('onFinish Error', err);
          });
      }
    });
  };

  let showTitle = null;
  if (formmode) {
    if (formmode !== FormModeEnum.view) {
      showTitle = `${FormModeLabelEnum[formmode]}${title}`;
    } else {
      showTitle = null;
    }
  } else {
    showTitle = title;
  }

  return (
    <div style={{ display: 'inline-block', ...style }}>
      {children ? (
        <Fragment>
          {React.cloneElement(children as any, {
            onClick: () => {
              if (onClickCallback) {
                onClickCallback();
              }
              setVisible(true);
            },
            style: { display: 'inline-block' },
          })}
        </Fragment>
      ) : (
        <Button
          type="primary"
          onClick={() => {
            if (onClickCallback) {
              onClickCallback();
            }
            setVisible(true);
          }}
        >
          {buttonText}
        </Button>
      )}

      <Drawer
        title={showTitle}
        placement={placement}
        width={width}
        closable={formmode === FormModeEnum.view ? false : closable}
        onClose={onClosed}
        visible={visible}
        destroyOnClose={destroyOnClose}
        bodyStyle={bodyStyle}
        {...ext}
      >
        {formmode === FormModeEnum.view ? (
          <ProDescriptions<any>
            column={2}
            title={record?.username}
            request={async () => ({
              data: record || {},
            })}
            params={{
              id: record?.username,
            }}
            columns={columns}
            {...descriptionsProps}
          />
        ) : (
          <Spin spinning={stateLoading}>
            <Form form={form}>
              <CCForm columns={columns} record={record} form={form} />
            </Form>
          </Spin>
        )}
        <div style={{ width }} className="btnWrap">
          {footer || (
            <Fragment>
              {formmode === FormModeEnum.view ? (
                <Button onClick={onClosed}>关闭</Button>
              ) : (
                <Row>
                  <Button onClick={onClosed} loading={stateLoading}>
                    取消
                  </Button>
                  {saveButton && (
                    <Button onClick={onSave} style={{ margin: '0 0 0 8px' }} loading={stateLoading}>
                      暂存
                    </Button>
                  )}
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={onSubmit}
                    loading={stateLoading}
                  >
                    确定
                  </Button>
                </Row>
              )}
            </Fragment>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default CCDrawer;
