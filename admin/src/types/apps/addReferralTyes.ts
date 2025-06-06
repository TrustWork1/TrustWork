import { BaseApiResponse } from 'src/interface/common.interface'

export type IAppReferralModel = {
  AppReferContentItem: {
    id: number
    content: string
    icon: string
  }

  AppReferContentPayload: FormData

  AppReferContentResponse: BaseApiResponse & {
    data: IAppReferralModel['AppReferContentItem'][]
  }

  updateReferContentResponse: BaseApiResponse & {
    data: IAppReferralModel['AppReferContentItem']
  }

  SaveAppReferralListResponse: BaseApiResponse & {
    data: IAppReferralModel['AppReferContentItem']
  }
}
