import appInfo from 'src/configs/landing-website/home/app-info'
import axiosInstance from '../interceptors/auth.interceptor'
import { IHomeCmsModel } from '@/type/apps/homeCmsTypes'
import appFeatures from 'src/configs/landing-website/home/app-features'
import howItworks from 'src/configs/landing-website/home/how-it-works'
import referral from 'src/configs/landing-website/home/referral'
import download from 'src/configs/landing-website/home/download'
import packages from 'src/configs/landing-website/home/packages'

export const fetchAppInfoCmsList = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['AppInfoListResponse']>(appInfo.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}

export const saveAppInfoCmsList = async (data: IHomeCmsModel['AppInfoPayload']) => {
  const url = `${appInfo.save}`
  const res = await axiosInstance.post<IHomeCmsModel['SaveAppInfoListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const updateAppInfoCmsList = async (data: IHomeCmsModel['AppInfoPayload']) => {
  const url = `${appInfo.update}`
  const res = await axiosInstance.put<IHomeCmsModel['UpdateAppInfoListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const fetchAppFeaturesCmsList = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['AppFeaturesListResponse']>(appFeatures.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}

export const updateAppFeaturesCmsList = async (id: string, data: IHomeCmsModel['AppInfoPayload']) => {
  const url = `${appFeatures.update}${id}/`
  const res = await axiosInstance.put<IHomeCmsModel['UpdateAppFeaturesListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}

export const saveAppFeaturesCmsList = async (data: IHomeCmsModel['AppInfoPayload']) => {
  const url = `${appFeatures.save}`
  const res = await axiosInstance.post<IHomeCmsModel['SaveAppFeaturesListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}

export const deleteAppFeaturesCmsList = async (id: string | number) => {
  const url = `${appFeatures.delete}${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
export const fetchAppFeatureCmsContent = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['AppFeaturesContentResponse']>(appFeatures.content, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const updateAppFeatureCmsContent = async (data: IHomeCmsModel['AppFeaturesContentPayload']) => {
  const url = `${appFeatures.content}`
  const res = await axiosInstance.put<IHomeCmsModel['AppFeaturesContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const fetchHowItWorksCmsContent = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['HowItWorksContentResponse']>(howItworks.content, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const updateHowItWorksCmsContent = async (data: IHomeCmsModel['HowItWorksContentPayload']) => {
  const url = `${howItworks.content}`
  const res = await axiosInstance.put<IHomeCmsModel['HowItWorksContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const fetchHowItWorksStepsCmsList = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['AppFeaturesListResponse']>(howItworks.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const updateHowItWorksStepsCmsList = async (id: string, data: IHomeCmsModel['HowItWorksStepsPayload']) => {
  const url = `${howItworks.update}${id}/`
  const res = await axiosInstance.put<IHomeCmsModel['UpdateHowItWorksListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const saveHowItWorksStepsCmsList = async (data: IHomeCmsModel['HowItWorksStepsPayload']) => {
  const url = `${howItworks.save}`
  const res = await axiosInstance.post<IHomeCmsModel['SaveHowItWorksListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}
export const deleteHowItWorksStepsCmsList = async (id: string | number) => {
  const url = `${howItworks.delete}${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}


export const fetchReferralCmsContent = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['ReferralContentResponse']>(referral.content, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const updateReferralCmsContent = async (data: IHomeCmsModel['ReferralContentPayload']) => {
  const url = `${referral.content}`
  const res = await axiosInstance.put<IHomeCmsModel['ReferralContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}


export const fetchDownloadCmsContent = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['DownloadContentResponse']>(download.content, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const updateDownloadCmsContent = async (data: IHomeCmsModel['DownloadContentPayload']) => {
  const url = `${download.content}`
  const res = await axiosInstance.put<IHomeCmsModel['DownloadContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}

export const fetchPackagesCmsContent = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['AppFeaturesContentResponse']>(packages.content, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const updatePackagesCmsContent = async (data: IHomeCmsModel['AppFeaturesContentPayload']) => {
  const url = `${packages.content}`
  const res = await axiosInstance.put<IHomeCmsModel['AppFeaturesContentResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}

export const fetchPackagesList = async () => {
  const res = await axiosInstance.get<IHomeCmsModel['PackagesListResponse']>(packages.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}

export const updatePackagesList = async (id: string, data: IHomeCmsModel['PackagesPayload']) => {
  const url = `${packages.update}${id}/`
  const res = await axiosInstance.put<IHomeCmsModel['UpdatePackagesListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}

export const savePackagesList = async (data: IHomeCmsModel['PackagesPayload']) => {
  const url = `${packages.save}`
  const res = await axiosInstance.post<IHomeCmsModel['SavePackagesListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/form-data'
    }
  })

  return res.data
}

export const deletePackagesList = async (id: string | number) => {
  const url = `${packages.delete}${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}