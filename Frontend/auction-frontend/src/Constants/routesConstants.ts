export const routes = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    HOME: '/',
    AUCTIONS: '/auctions',
    AUCTION: '/auction',
    PROFILE: '/profile'
} as const;

export type Routes = keyof typeof routes;