import { ITermsAndPrivacyCmsModel } from '@/type/apps/terms-policy'
import axiosInstance from '../interceptors/auth.interceptor'
import termsPolicy from 'src/configs/landing-website/home/terms-policy'

export const fetchTermsAndConditionCmsContent = async () => {
  const res = await axiosInstance.get<ITermsAndPrivacyCmsModel['TermsAndPrivacyResponse']>(termsPolicy.terms, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}

export const saveTermsAndConditionCmsContent = async (data: ITermsAndPrivacyCmsModel['TermsAndPrivacyPayload']) => {
  const url = `${termsPolicy.terms}`
  const res = await axiosInstance.post<ITermsAndPrivacyCmsModel['SaveTermsAndPrivacyResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const updateTermsAndConditionCmsContent = async (data: ITermsAndPrivacyCmsModel['TermsAndPrivacyPayload']) => {
  const url = `${termsPolicy.terms}`
  const res = await axiosInstance.put<ITermsAndPrivacyCmsModel['UpdateTermsAndPrivacyResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}


export const fetchPrivacyPolicyCmsContent = async () => {
  const res = await axiosInstance.get<ITermsAndPrivacyCmsModel['TermsAndPrivacyResponse']>(termsPolicy.policy, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}

export const savePrivacyPolicyCmsContent = async (data: ITermsAndPrivacyCmsModel['TermsAndPrivacyPayload']) => {
  const url = `${termsPolicy.policy}`
  const res = await axiosInstance.post<ITermsAndPrivacyCmsModel['SaveTermsAndPrivacyResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const updatePrivacyPolicyCmsContent = async (data: ITermsAndPrivacyCmsModel['TermsAndPrivacyPayload']) => {
  const url = `${termsPolicy.policy}`
  const res = await axiosInstance.put<ITermsAndPrivacyCmsModel['UpdateTermsAndPrivacyResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}