import authStore from '../Stores/auth.store'
import { observer } from 'mobx-react'
import type { FC } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteProps } from 'react-router-dom'
import React from 'react'

const RestrictedRoute: FC<RouteProps> = ({ children }: RouteProps) => {
  if (authStore.user) {
    return <Navigate to="/profile/myauctions" />
  }
  return children as React.JSX.Element
}

export default observer(RestrictedRoute)
