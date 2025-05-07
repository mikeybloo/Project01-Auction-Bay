export const statusCode = {
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403
} as const;

export type StatusCode = keyof typeof statusCode;