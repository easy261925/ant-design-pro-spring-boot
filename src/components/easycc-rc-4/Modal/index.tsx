import React, { CSSProperties, Fragment, useState, ReactNode } from 'react';
import { Modal, Button } from 'antd';

interface CCModalProps {
  style?: CSSProperties;
  onClickCallback?: () => void;
  buttonText?: string;
  title?: string;
  onFinish?: (values?: any) => Promise<any>;
  onClose?: () => void;
  footer?: ReactNode;
  cancelText?: string;
  okText?: string;
  content?: ReactNode;
  width?: number;
  bodyStyle?: CSSProperties;
  modalStyle?: CSSProperties;
  destroyOnClose?: boolean;
}

const CCModal: React.FC<CCModalProps> = (props) => {
  const {
    style,
    children,
    onClickCallback,
    buttonText = '打开',
    title = 'Modal 标题',
    onFinish,
    onClose,
    footer,
    cancelText = '关闭',
    okText = '确定',
    content = <div>content</div>,
    width = 650,
    bodyStyle = { minHeight: 450 },
    modalStyle,
    destroyOnClose = true,
    ...ext
  } = props;
  const [visible, setVisible] = useState(false);
  // eslint-disable-next-line
  const [stateLoading, setStateLoading] = useState(false);

  const onSubmit = async () => {
    if (onFinish) {
      setStateLoading(true);
      onFinish()
        .then((res) => {
          if (res.success) {
            setStateLoading(false);
            setVisible(false);
          }
        })
        .catch((err) => {
          setStateLoading(false);
          console.log('onFinish Error', err);
        });
    } else {
      setVisible(false);
    }
  };

  const onClosed = () => {
    if (onClose) {
      onClose();
      setVisible(false);
    } else {
      setVisible(false);
    }
  };

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

      <Modal
        visible={visible}
        title={title}
        onOk={onSubmit}
        onCancel={onClosed}
        footer={footer}
        cancelText={cancelText}
        okText={okText}
        width={width}
        bodyStyle={bodyStyle}
        style={modalStyle}
        destroyOnClose={destroyOnClose}
        {...ext}
      >
        {content}
      </Modal>
    </div>
  );
};

export default CCModal;
