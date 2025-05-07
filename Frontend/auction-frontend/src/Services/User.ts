import { apiRoutes } from '../Constants/apiConstants'
import { apiRequest } from './Api'
import type { LoginUserFields } from '../Hooks/react-hook-form/useLogin'
import type { UserType } from '../Models/auth'
import type { RegisterUserFields } from '../Hooks/react-hook-form/useRegister'
import type { UpdateUserFields } from '../Hooks/react-hook-form/useUpdateUser'

export const fetchUser = async () =>
    apiRequest<undefined, UserType>('get', apiRoutes.FETCH_USER)
  
  export const fetchUsers = async (pageNumber: number) =>
    apiRequest<number, UserType[]>(
      'get',
      `${apiRoutes.FETCH_USERS}?page=${pageNumber}`,
    )
  
  export const login = async (data: LoginUserFields) =>
    apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)
  
  export const register = async (data: RegisterUserFields) =>
    apiRequest<RegisterUserFields, UserType>('post', apiRoutes.SIGNUP, data)
  
  export const signout = async () =>
    apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)
  
  export const uploadAvatar = async (formData: FormData, id: string) =>
    apiRequest<FormData, void>(
      'post',
      `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
      formData,
    )
  
  export const updateUser = async (data: UpdateUserFields, id: string) =>
    apiRequest<UpdateUserFields, void>(
      'patch',
      `${apiRoutes.USERS_PREFIX}/${id}`,
      data,
    )
  
  export const deleteUser = async (id: string) =>
    apiRequest<string, UserType>('delete', `${apiRoutes.USERS_PREFIX}/${id}`)
  