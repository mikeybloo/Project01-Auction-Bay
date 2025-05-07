export const apiRoutes = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    SIGNOUT: '/auth/signout',
    FETCH_USER: '/auth',
    FETCH_USERS: '/users',
    USERS_PREFIX: '/users',
    UPLOAD_AVATAR_IMAGE: '/users/upload',
    UPLOAD_PRODUCT_IMAGE: '/auctions/upload',
    AUCTIONS_PREFIX: '/auctions'
} as const;

export type ApiRoutes = keyof typeof apiRoutes;