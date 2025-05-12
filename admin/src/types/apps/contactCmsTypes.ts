import { BaseApiResponse } from 'src/interface/common.interface'

export type IContactCmsModel = {
  ContactInfoContent: {
    id?: number
    section_header: string
    section_description: string
    title: string
    description: string
    call_center_number: string
    email: string
    location: string
    facebook_url: string
    x_url: string
    linkedin_url: string
    youtube_url: string
    map_url: string
    longitude: string
    latitude: string
    get_in_touch_title: string
    get_in_touch_description: string
  }

  ContactFormListData: {
    id: 1,
    full_name: "mr. tester",
    email: "demo@gmail.com",
    subject: "Query1",
    message: "Testing"
  }[]


  ContactInfoContentPayload: FormData
  

  ContactInfoContentResponse: BaseApiResponse & { data: IContactCmsModel['ContactInfoContent'] }
  ContactFormListResponse: BaseApiResponse & { data: IContactCmsModel['ContactFormListData'] }
}