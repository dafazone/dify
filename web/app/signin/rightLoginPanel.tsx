'use client'
import styles from './index.module.css'
import CustomSwitch from '../components/signin/customSwitch'
import { Popover } from 'antd-mobile'
import ZhIcon from '../components/signin/menuIcons/zh-icon'
import EnIcon from '../components/signin/menuIcons/en-icon'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SvgIcon from '../components/svg-icon'
import { Button, Form, Input, message } from 'antd'
import { login } from '@/service/common'
import { useContext } from 'use-context-selector'
// import I18NContext from '@/context/i18n'
import { useRouter, useSearchParams } from 'next/navigation'
import I18n from '@/context/i18n'

const RightLoginPanel = () => {
  const { t } = useTranslation()

  const { locale, setLocaleOnClient } = useContext(I18n)

  const [title, setTitle] = useState('login')

  const [languageTitle, setLanguageTitle] = useState<string>('中文')

  const [languageIcon, setLanguageIcon] = useState<any>('icon_zh')

  //   const [loading, setLoading] = useState<boolean>(false)

  const [form] = Form.useForm()

  //   const { locale } = useContext(I18NContext)

  const router = useRouter()

  const searchParams = useSearchParams()

  const invite_token = decodeURIComponent(searchParams.get('invite_token') || '')

  const languageOptions = [
    // { value: '中文' },
    // { value: 'English' }
    { key: 'zh-Hans', text: '中文', icon: <ZhIcon />, iconName: 'icon_zh' },
    { key: 'en-US', text: 'English', icon: <EnIcon />, iconName: 'icon_En' },
  ]

  const formItemLayout = {
    labelCol: { span: 16 },
    // wrapperCol: { span: 8 },
  }

  const isInvite = Boolean(invite_token && invite_token !== 'null')

  /**
     * @description 切换语言
     * @param node 语言信息
     */
  const changeLanguage = (node: any) => {
    setLanguageTitle(node.text)
    setLanguageIcon(node.iconName)
    // i18n.changeLanguage(node.key) // 参值为'en'或'zh'
    setLocaleOnClient(node.key)
  }

  const onCheck = async () => {
    try {
      const params = await form.validateFields()
      const { password, confirmPassword, email } = params
      if(title === 'register' && password !== confirmPassword) {
        message.warning(t('registWarning'))
        return false
      }
      const loginData: Record<string, any> = {
        email,
        password,
        language: locale,
        remember_me: true,
      }
      if (title === 'login') {
        const res: any = await login({
          url: '/login',
          body: loginData,
        })
        if (res?.result === 'success') {
          if (isInvite) {
            router.replace(`/signin/invite-settings?${searchParams.toString()}`)
          }
          else {
            localStorage.setItem('console_token', res.data.access_token)
            localStorage.setItem('refresh_token', res.data.refresh_token)
            router.replace('/apps')
          }
        }
      }
    }
    catch(errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const changeTitle = () => {
    setTitle(title => (title === 'login' ? 'register' : 'login'))
    form.setFieldsValue({})
    form.resetFields()
  }

  useEffect(() => {
    console.log('locale', locale)
    const findIndex = languageOptions.findIndex((item: any) => item.key === locale)
    if(findIndex > -1) {
      const node = languageOptions[findIndex]
      setLanguageTitle(node.text)
      setLanguageIcon(node.iconName)
    }
  }, [locale])

  return (
    <>
      <div className={styles.rightContainer}>
        <div className={styles.modePanel}>
          {/* <Switch
            onChange={handleThemeChange}
            className={!isDarkTheme ? styles.uncheckedSwitch : styles.checkedSwitch}
          /> */}
          <CustomSwitch />
          <div className={styles.language}>
            <Popover.Menu
              actions={languageOptions}
              placement="bottom-start"
              trigger="click"
              className='languagePopover'
              onAction={(node: any) => changeLanguage(node)}
            >
              <div className={styles.languageSelect}>
                <SvgIcon name={languageIcon} width={24} />
                <div className={styles.languageTitle}>{languageTitle}</div>
                <SvgIcon name={'chevron-down'} width={13} color='yellow' />
              </div>
            </Popover.Menu>
          </div>
        </div>
        <div className={styles.loginFormPanel}>
          <div className={styles.cropLogo}>
            <SvgIcon name='zd' width={21} />
            <div>{t('login.zhongding')}</div>
          </div>
          <div className={styles.loginTitle}>
            <div>{title === 'login' ? t('login.userlogin') : t('login.register')}</div>
            <span>
              {title === 'login'
                ? t('login.loginDescription')
                : t('login.registerDescription')}
            </span>
          </div>
          <Form
            form={form}
            layout="vertical"
            name="dynamic_rule"
            style={{ maxWidth: 600 }}
          >
            {title === 'register' && (
              <>
                <Form.Item
                  {...formItemLayout}
                  name="email"
                  label={t('login.emailLabel')}
                  rules={[
                    { required: true, message: t('login.emailPlaceholder') },
                    {
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('login.emailCheck'),
                    },
                  ]}
                >
                  <Input size="large" placeholder={t('login.emailPlaceholder')} className={styles.loginInput} />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  name="nickname"
                  label={t('login.nameLabel')}
                  rules={[{ required: true, message: t('login.namePlaceholder') }]}
                >
                  <Input size="large" placeholder={t('login.namePlaceholder')} />
                </Form.Item>
              </>
            )}
            {/* <Form.Item
            {...formItemLayout}
            name="email"
            label={t('emailLabel')}
            rules={[{ required: true, message: t('emailPlaceholder') }]}
          >
            <Input size="large" placeholder={t('emailPlaceholder')} />
          </Form.Item> */}
            {title === 'login' && (
              <Form.Item
                {...formItemLayout}
                name="email"
                label={t('login.nicknameLabel')}
                rules={[{ required: true, message: t('login.nicknamePlaceholder') }]}
              >
                <Input size="large" placeholder={t('login.nicknamePlaceholder')} className={styles.loginInput} />
              </Form.Item>
            )}
            <Form.Item
              {...formItemLayout}
              name="password"
              label={t('login.passwordLabel')}
              rules={[{ required: true, message: t('login.passwordPlaceholder') }]}
            >
              <Input.Password
                size="large"
                placeholder={t('login.passwordPlaceholder')}
                // onPressEnter={onCheck}
                className={styles.loginInput}
              />
            </Form.Item>
            {title === 'register' && (
              <Form.Item
                {...formItemLayout}
                name="confirmPassword"
                label={t('login.confirmPwLabel')}
                rules={[{ required: true, message: t('login.confirmPwPlaceholder') }]}
              >
                <Input.Password size="large" placeholder={t('login.confirmPwPlaceholder')} className={styles.loginInput} />
              </Form.Item>
            )}
            {/* {title === 'login' && (
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox> {t('rememberMe')}</Checkbox>
              </Form.Item>
            )} */}
            <Button
              type="primary"
              block
              size="large"
              onClick={onCheck}
              //   loading={loading}
              className={styles.loginBtn}
            >
              {title === 'login' ? t('login.login') : t('login.regist')}
            </Button>
            <div className={styles.forgetTipPanel}>
              {title === 'login' && (
                <>
                  {/* <div>
                    {t('login.withoutAccount')}
                    <a onClick={changeTitle} className={styles.registLink}>
                      {t('login.currentRegist')}
                    </a>
                  </div> */}
                  <div>
                    {t('login.signInTip')}
                    <a className={styles.connectLink}>
                      {t('login.connectAdmin')}
                    </a>
                  </div>
                </>
              )}
              {title === 'register' && (
                <div>
                  {t('login.signUpTip')}
                  <a onClick={changeTitle} className={styles.registLink}>
                    {t('login.login')}
                  </a>
                </div>
              )}
            </div>
            {/* {title === 'login' && (
              <>
                {location.host === Domain && (
                  <Button
                    block
                    size="large"
                    onClick={toGoogle}
                    style={{ marginTop: 15 }}
                  >
                    <div className="flex items-center">
                      <Icon
                        icon="local:github"
                        style={{ verticalAlign: 'middle', marginRight: 5 }}
                      />
                      Sign in with Github
                    </div>
                  </Button>
                )}
              </>
            )} */}
          </Form>
        </div>
        <div className={styles.copyrightPanel}>
          {t('login.copyright')}
        </div>
        <div className={styles.decorationBg}></div>
      </div>
    </>
  )
}

export default RightLoginPanel
