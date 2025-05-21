export const apiRoutes = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    SIGNOUT: '/auth/signout',
    FETCH_USER: '/auth',
    USERS_PREFIX: '/me',
    UPLOAD_AVATAR_IMAGE: '/users/upload',
    UPLOAD_AUCTION_IMAGE: '/auctions/upload',
    AUCTIONS_PREFIX: '/auctions'
} as const;

export type ApiRoutes = keyof typeof apiRoutes;