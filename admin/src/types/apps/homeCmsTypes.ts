import { BaseApiResponse } from 'src/interface/common.interface'

export type IHomeCmsModel = {
  AppInfoList: {
    tagline: string
    title: string
    description: string
    playstore_link: string
    appstore_link: string
    image: string
  }
  AppFeaturesContentPayload: FormData
  AppFeaturesContentData: {
    id: number
    header: string
    description: string
  }
  AppInfoPayload: FormData
  AppFeaturesList: {
    title: string
    description: string
    icon: string
  }
  AppFeaturesListDetails: {
    id: number
    title: string
    description: string
    icon: string
  }[]

  AppFeaturesFormValues: {
    features: {
      id?: number
      displayIndex?: number
      title: string
      description: string
      icon: File | string | undefined
    }[]
  }

  HowItWorksContentPayload: FormData
  HowItWorksContent: {
    id?: number
    header: string
    description: string
    image: string
  }
  HowItWorksStepsPayload: FormData
  HowItWorksStepsList: {
    title: string
    description: string
    icon: string
  }
  AppFeaturesPayload: FormData


  PackagesListDetails: {
    plans: IHomeCmsModel['Plans'][]
  }
  Plans: {
    id: string
    plan_name: string
    description: string
    price: string
    billing_cycle: string
    features: IHomeCmsModel['Features'][]
  }
  Features: {
    id: string
    features: string
    is_active: string
  }
  PackagesPayload: FormData

  ReferralContentPayload: FormData
  ReferralContentData: {
    title: string
    description: string
    button_title: string
    button_link: string
    image: string
  }

  DownloadContentPayload: FormData
  DownloadContentData: {
    title: string
    description: string
    playstore_link: string
    appstore_link: string
    image: string
  }

  AppInfoListResponse: BaseApiResponse & { data: IHomeCmsModel['AppInfoList'] }
  SaveAppInfoListResponse: BaseApiResponse & { data: IHomeCmsModel['AppInfoList'] }
  UpdateAppInfoListResponse: BaseApiResponse & { data: IHomeCmsModel['AppInfoList'] }
  AppFeaturesListResponse: BaseApiResponse & { data: IHomeCmsModel['AppFeaturesListDetails'] }
  UpdateAppFeaturesListResponse: BaseApiResponse & { data: IHomeCmsModel['AppFeaturesList'] }
  SaveAppFeaturesListResponse: BaseApiResponse & { data: IHomeCmsModel['AppFeaturesList'] }
  AppFeaturesContentResponse: BaseApiResponse & { data: IHomeCmsModel['AppFeaturesContentData'] }
  HowItWorksContentResponse: BaseApiResponse & { data: IHomeCmsModel['HowItWorksContent'] }
  UpdateHowItWorksListResponse: BaseApiResponse & { data: IHomeCmsModel['HowItWorksStepsList'] }
  SaveHowItWorksListResponse: BaseApiResponse & { data: IHomeCmsModel['HowItWorksStepsList'] }
  ReferralContentResponse: BaseApiResponse & { data: IHomeCmsModel['ReferralContentData'] }
  DownloadContentResponse: BaseApiResponse & { data: IHomeCmsModel['DownloadContentData'] }
  PackagesListResponse: BaseApiResponse & { data: IHomeCmsModel['PackagesListDetails'] }
  SavePackagesListResponse: BaseApiResponse & { data: IHomeCmsModel['PackagesListDetails'] }
  UpdatePackagesListResponse: BaseApiResponse & { data: IHomeCmsModel['PackagesListDetails'] }
}
