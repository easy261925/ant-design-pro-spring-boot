import { LockOutlined, MailTwoTone, MobileTwoTone, UserOutlined } from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { connect, Dispatch, useIntl, FormattedMessage } from 'umi';
import { StateType } from '@/models/login';
import { getCaptchaService, LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';

import styles from './index.less';

interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType, statusContent = '' } = userLogin;
  const [type, setType] = useState<string>('account');
  const intl = useIntl();

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    if (type === 'account') {
      const { userName, password } = values;
      dispatch({
        type: 'login/userLogin',
        payload: { userName, password, type },
      });
    } else {
      const { mobile, captcha } = values;
      dispatch({
        type: 'login/userLogin',
        payload: { phone: mobile, verifyCode: captcha, type },
      });
    }
  };

  const tabsOnChange = (currentType: string) => {
    const { dispatch } = props;
    setType(currentType);
    dispatch({
      type: 'login/save',
      payload: {
        statusContent: '',
      },
    });
  };

  // const loginWith = (current: string) => {
  //   switch (current) {
  //     case 'wechart':
  //       window.open('http://localhost:8150/api/ucenter/wx/login');
  //       break;
  //     default:
  //       break;
  //   }
  // };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values: LoginParamsType) => {
          handleSubmit(values);
        }}
      >
        <Tabs activeKey={type} onChange={tabsOnChange}>
          <Tabs.TabPane
            key="account"
            tab={intl.formatMessage({
              id: 'pages.login.accountLogin.tab',
              defaultMessage: '??????????????????',
            })}
          />
          {/* <Tabs.TabPane
            key="mobile"
            tab={intl.formatMessage({
              id: 'pages.login.phoneLogin.tab',
              defaultMessage: '???????????????',
            })}
          /> */}
        </Tabs>

        {!status && loginType === 'account' && !submitting && statusContent && (
          <LoginMessage content={statusContent} />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="userName"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder="??????????????????"
              rules={[
                {
                  required: true,
                  message: '??????????????????',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="???????????????"
              rules={[
                {
                  required: true,
                  message: '???????????????',
                },
              ]}
            />
          </>
        )}

        {!status && loginType === 'mobile' && !submitting && statusContent && (
          <LoginMessage content={statusContent} />
        )}
        {type === 'mobile' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileTwoTone className={styles.prefixIcon} />,
              }}
              name="mobile"
              placeholder={intl.formatMessage({
                id: 'pages.login.phoneNumber.placeholder',
                defaultMessage: '?????????',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.phoneNumber.required"
                      defaultMessage="?????????????????????"
                    />
                  ),
                },
                {
                  pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
                  message: (
                    <FormattedMessage
                      id="pages.login.phoneNumber.invalid"
                      defaultMessage="????????????????????????"
                    />
                  ),
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <MailTwoTone className={styles.prefixIcon} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.captcha.placeholder',
                defaultMessage: '??????????????????',
              })}
              captchaTextRender={(timing, count) =>
                timing
                  ? `${count} ${intl.formatMessage({
                    id: 'pages.getCaptchaSecondText',
                    defaultMessage: '???????????????',
                  })}`
                  : intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '???????????????',
                  })
              }
              name="captcha"
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.captcha.required"
                      defaultMessage="?????????????????????"
                    />
                  ),
                },
              ]}
              onGetCaptcha={async (mobile) => {
                const result = await getCaptchaService(mobile);
                if (result.success === false) {
                  return;
                }
                message.success(`???????????????????????????????????????${result.data.verifyCode}`, 10);
              }}
            />
          </>
        )}
        {/* <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            <FormattedMessage id="pages.login.rememberMe" defaultMessage="????????????" />
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            <FormattedMessage id="pages.login.forgotPassword" defaultMessage="????????????" />
          </a>
          </div> */}
      </ProForm>
      {/* <Space className={styles.other}>
        <FormattedMessage id="pages.login.loginWith" defaultMessage="??????????????????" />
        <WechatOutlined className={styles.icon} onClick={() => loginWith('wechart')} />
      </Space> */}
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/userLogin'],
}))(Login);
