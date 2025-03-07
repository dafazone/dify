'use client'
// import styles from './index.module.css'
// import { useTranslation } from 'react-i18next'
import LeftLoginPanel from './leftLoginPanel'
import RightLoginPanel from './rightLoginPanel'

export default function SignIn() {
  // const { t } = useTranslation()

  return (
    <>
      <LeftLoginPanel />
      <RightLoginPanel />
      {/* <OneMoreStep /> */}
    </>
  )
}
