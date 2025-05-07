export const routes = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    HOME: '/',
    AUCTIONS: '/auctions',
    AUCTION: '/auction'
} as const;

export type Routes = keyof typeof routes;