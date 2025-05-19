import Axios from 'axios'
import type { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'

export async function apiRequest<D = Record<string, unknown>, R = unknown>(
  method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch',
  path: string,
  input?: D,
  options?: {
    headers?: AxiosRequestHeaders
  } & AxiosRequestConfig,
) {
  try {
    const response = await Axios.request<R>({
      baseURL: import.meta.env.VITE_API_URL,
      url: path,
      method: method,
      data: input,
      headers: options?.headers,
      withCredentials: true,
    })
    return response
  } catch (error: any) {
    console.log(error)
    return error.response
  }
}

export * from './User'
