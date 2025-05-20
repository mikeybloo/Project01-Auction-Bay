import { apiRoutes } from '../Constants/apiConstants'
import { apiRequest } from './Api'
import type { LoginUserFields } from '../Hooks/react-hook-form/useLogin'
import type { UserType } from '../Models/auth'
import type { RegisterUserFields } from '../Hooks/react-hook-form/useRegister'
import type { UpdateUserFields } from '../Hooks/react-hook-form/useUpdateUser'
import type { UpdatePasswordFields } from '../Hooks/react-hook-form/useUpdatePassword'

export const fetchUser = async () =>
    apiRequest<undefined, UserType>('get', apiRoutes.FETCH_USER)
  
  export const login = async (data: LoginUserFields) =>
    apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)
  
  export const register = async (data: RegisterUserFields) =>
    apiRequest<RegisterUserFields, UserType>('post', apiRoutes.SIGNUP, data)
  
  export const signout = async () =>
    apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)
  
  export const uploadAvatar = async (formData: FormData) =>
    apiRequest<FormData, void>(
      'post',
      `${apiRoutes.USERS_PREFIX}/upload`,
      formData,
    )
  
  export const updateUserPassword = async (data: UpdatePasswordFields) =>
    apiRequest<UpdatePasswordFields, void>(
      'patch',
      `${apiRoutes.USERS_PREFIX}/update-password`,
      data,
    )

    export const updateUser = async (data: UpdateUserFields) =>
    apiRequest<UpdateUserFields, void>(
      'patch',
      `${apiRoutes.USERS_PREFIX}/update`,
      data,
    )
  