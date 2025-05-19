import type { FC, ReactNode } from 'react'
import Navigation from './Navigation'

interface Props {
  children: ReactNode | ReactNode[]
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="layout-container container-xxl p-4">{children}</div>
    </>
  )
}

export default Layout
