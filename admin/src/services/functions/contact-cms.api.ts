import { IContactCmsModel } from '@/type/apps/contactCmsTypes'
import axiosInstance from '../interceptors/auth.interceptor'
import contactInfo from 'src/configs/landing-website/contact-us/contact-info'
import contactForm from 'src/configs/landing-website/contact-us/contact-form'

export const fetchContactInfoCmsList = async () => {
  const res = await axiosInstance.get<IContactCmsModel['ContactInfoContentResponse']>(contactInfo.content, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const saveContactInfoCmsList = async (data: IContactCmsModel['ContactInfoContentPayload']) => {
  const url = `${contactInfo.content}`
  const res = await axiosInstance.post<IContactCmsModel['ContactInfoContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const updateContactInfoCmsList = async (data: IContactCmsModel['ContactInfoContentPayload']) => {
  const url = `${contactInfo.content}`
  const res = await axiosInstance.put<IContactCmsModel['ContactInfoContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const fetchContactFormList = async () => {
  const res = await axiosInstance.get<IContactCmsModel['ContactFormListResponse']>(contactForm.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}