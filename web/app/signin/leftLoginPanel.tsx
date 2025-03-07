'use client'
import styles from './index.module.css'
import { useTranslation } from 'react-i18next'

const LeftLoginPanel = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className={styles.leftContainer}>
        <div className={styles.sytemTitle}>
          <div>{t('login.dify')}</div>
          <div>{t('login.introduce')}</div>
          <div>{t('login.loginTip')}</div>
        </div>
        <div className={styles.bottomTitle}>
          <span>{t('login.zhongding')}</span>
          <span>{t('login.zhihui')}</span>
          <span>{t('login.funeng')}</span>
        </div>
      </div>
    </>
  )
}

export default LeftLoginPanel
