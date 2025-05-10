import authStore from '../Stores/auth.store'
import { observer } from 'mobx-react'
import type { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { RouteProps } from 'react-router-dom'
import React from 'react'

const PrivateRoute: FC<RouteProps> = ({ children }: RouteProps) => {
  const location = useLocation()

  if (!authStore.user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      />
    )
  }

  return children as React.JSX.Element
}

export default observer(PrivateRoute)
