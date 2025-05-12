import axiosInstance from '../interceptors/auth.interceptor'
import { IAboutCmsModel } from '@/type/apps/aboutCmsTypes'
import aboutInfo from 'src/configs/landing-website/about-us/about-info'
import whyTrustUs from 'src/configs/landing-website/about-us/why-trust-us'

export const fetchAboutInfoCmsList = async () => {
  const res = await axiosInstance.get<IAboutCmsModel['AboutInfoContentResponse']>(aboutInfo.content, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}

export const saveAboutInfoCmsList = async (data: IAboutCmsModel['AboutInfoContentPayload']) => {
  const url = `${aboutInfo.content}`
  const res = await axiosInstance.post<IAboutCmsModel['AboutInfoContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const updateAboutInfoCmsList = async (data: IAboutCmsModel['AboutInfoContentPayload']) => {
  const url = `${aboutInfo.content}`
  const res = await axiosInstance.put<IAboutCmsModel['AboutInfoContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}


export const fetchWhyTrustUsCmsList = async () => {
  const res = await axiosInstance.get<IAboutCmsModel['WhyTrustUsContentResponse']>(whyTrustUs.content, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}

export const saveWhyTrustUsCmsList = async (data: IAboutCmsModel['WhyTrustUsContentPayload']) => {
  const url = `${whyTrustUs.content}`
  const res = await axiosInstance.post<IAboutCmsModel['WhyTrustUsContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const updateWhyTrustUsCmsList = async (data: IAboutCmsModel['WhyTrustUsContentPayload']) => {
  const url = `${whyTrustUs.content}`
  const res = await axiosInstance.put<IAboutCmsModel['WhyTrustUsContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}


export const fetchWhyTrustUsPointsList = async () => {
  const res = await axiosInstance.get<IAboutCmsModel['WhyTrustUsPointsListResponse']>(whyTrustUs.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const saveWhyTrustUsPointsList = async (data: IAboutCmsModel['WhyTrustUsPointsPayload']) => {
  const url = `${whyTrustUs.save}`
  const res = await axiosInstance.post<IAboutCmsModel['WhyTrustUsPointsListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const updateWhyTrustUsPointsList = async (id: string, data: IAboutCmsModel['WhyTrustUsPointsPayload']) => {
  const url = `${whyTrustUs.update}${id}/`
  const res = await axiosInstance.put<IAboutCmsModel['WhyTrustUsPointsListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const deleteWhyTrustUsPointsList = async (id: string | number) => {
  const url = `${whyTrustUs.delete}${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}