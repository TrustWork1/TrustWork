import appReferrals from 'src/configs/landing-website/home/app-referrals'
import axiosInstance from '../interceptors/auth.interceptor'
import { IHomeCmsModel } from '@/type/apps/homeCmsTypes'
import { IAppReferralModel } from '@/type/apps/addReferralTyes'

export const fetchAppReferralCmsList = async () => {
  const res = await axiosInstance.get<IAppReferralModel['AppReferContentResponse']>(appReferrals.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}

export const updateAppReferralCmsList = async (id: string, data: IAppReferralModel['AppReferContentPayload']) => {
  const url = `${appReferrals.update}${id}`
  const res = await axiosInstance.put<IAppReferralModel['updateReferContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}

export const saveAppReferralCmsList = async (data: IHomeCmsModel['AppInfoPayload']) => {
  const url = `${appReferrals.save}`
  const res = await axiosInstance.post<IAppReferralModel['SaveAppReferralListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}

export const deleteAppReferralCmsList = async (id: string | number) => {
  const url = `${appReferrals.delete}${id}`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
