// import Header from './_header'
import styles from './index.module.css'

// import cn from '@/utils/classnames'

export default async function SignInLayout({ children }: any) {
  return (
    <div className={styles.loginPage}>
      {children}
    </div>
  )
}
