import axiosInstance from 'src/services/interceptors/auth.interceptor'
import auth from 'src/configs/auth'
import { IUserDetailsResponse, IUserEditResponse } from 'src/interface/api.interface'
import { TAdminChangePasswordParamType } from 'src/types/apps/admin'

export const adminDetailFetchFn = async () => {
  const url = `${auth.details}`
  const res = await axiosInstance.get<IUserDetailsResponse>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const adminDetailUpdateFn = async (data: FormData) => {
  const url = `${auth.update}/`
  const res = await axiosInstance.patch<IUserEditResponse>(url, data, {})

  return res.data
}

export const adminDetailChangePasswordFn = async (data: TAdminChangePasswordParamType) => {
  const url = `${auth.changePassword}/`
  const res = await axiosInstance.patch(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const adminLogoutFn = async () => {
  const url = `${auth.logout}/`
  const res = await axiosInstance.post(url)

  return res.data
}
