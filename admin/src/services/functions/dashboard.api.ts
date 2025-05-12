import dashboard from 'src/configs/dashboard'
import { IDashboardDetailsResponse } from 'src/interface/api.interface'
import axiosInstance from '../interceptors/auth.interceptor'

export const dashboardDetailFetchFn = async () => {
  const url = `${dashboard.list}`
  const res = await axiosInstance.get<IDashboardDetailsResponse>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
