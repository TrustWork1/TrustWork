import { BaseApiResponse } from 'src/interface/common.interface'

export type IAboutCmsModel = {
  AboutInfoContent: {
    id?: number
    section_header: string
    section_description: string
    title: string
    description: string
    image1: string
    image2: string
  }

  WhyTrustUsContent: {
    id?: number
    section_header: string
    section_description: string
    image: string
    section_image: string
    mission_title: string
    mission_description: string
    vision_title: string
    vision_description: string
  }

  WhyTrustUsPointsListDetails: {
    id: number
    title: string
    description: string
    icon: string
  }[]


  AboutInfoContentPayload: FormData
  WhyTrustUsContentPayload: FormData
  WhyTrustUsPointsPayload: FormData
  

  AboutInfoContentResponse: BaseApiResponse & { data: IAboutCmsModel['AboutInfoContent'] }
  WhyTrustUsContentResponse: BaseApiResponse & { data: IAboutCmsModel['WhyTrustUsContent'] }
  WhyTrustUsPointsListResponse: BaseApiResponse & { data: IAboutCmsModel['WhyTrustUsPointsListDetails'] }
}
