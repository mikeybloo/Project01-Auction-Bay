import { lazy, Suspense } from 'react'
import type { FC } from 'react'
import { Route, Routes as Switch } from 'react-router-dom'
import type { RouteProps } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'
import Auctions from '../Pages/Auctions'

export const RouteType = {
    PUBLIC: 0,
    PRIVATE: 1,
    RESTRICTED: 2
}

export type RouteType = typeof RouteType[keyof typeof RouteType]

type AppRoute = RouteProps & {
    type?: RouteType
}

//Public routes
const Home = lazy(() => import('../Pages/Home'))

//Restricted routes
const Login = lazy(() => import('../Pages/Login'))
const Register = lazy(() => import('../Pages/Register'))

//Private routes
const Auction = lazy(() => import('../Pages/Auction'))
const ProfileBidding = lazy(() => import('../Pages/Profile/Bidding'))
const ProfileMyAuctions = lazy(() => import('../Pages/Profile/MyAuctions'))
const ProfileWon = lazy(() => import('../Pages/Profile/Won'))

//Error routes
const Page404 = lazy(() => import('../Pages/Page404'))

export const AppRoutes: AppRoute[] = [
    {
        type: RouteType.RESTRICTED,
        path: '/login',
        children: <Login />
    },
    {
        type: RouteType.RESTRICTED,
        path: '/signup',
        children: <Register />
    },
    {
        type: RouteType.PRIVATE,
        path: '/profile/bidding',
        children: <ProfileBidding />,
    },
    {
        type: RouteType.PRIVATE,
        path: '/profile/myauctions',
        children: <ProfileMyAuctions />,
    },
    {
        type: RouteType.PRIVATE,
        path: '/profile/won',
        children: <ProfileWon />,
    },
    {
        type: RouteType.PRIVATE,
        path: '/auctions',
        children: <Auctions />,
    },
    {
        type: RouteType.PRIVATE,
        path: '/auction/:id',
        children: <Auction />,
    },
    {
        type: RouteType.PUBLIC,
        path: '/',
        children: <Home />,
    },
    {
        type: RouteType.PUBLIC,
        path: '*',
        children: <Page404 />,
    },
]


const Routes: FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                {AppRoutes.map((r) => {
                    const { type } = r
                    if (type === RouteType.PRIVATE) {
                        return (
                            <Route 
                                key={`${r.path}`}
                                path={`${r.path}`}
                                element={<PrivateRoute>{r.children}</PrivateRoute>}
                            />
                        )
                    }
                    if (type === RouteType.RESTRICTED) {
                        return (
                            <Route
                                key={`${r.path}`}
                                path={`${r.path}`}
                                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
                            />
                        )
                    }

                    return (
                        <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
                    )
                })}
                <Route path="*" element={<Page404 />} />
            </Switch>
        </Suspense>
    )
}

export default Routes