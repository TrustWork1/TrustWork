import { BaseApiResponse } from 'src/interface/common.interface'

export type ITermsAndPrivacyCmsModel = {
  TermsAndPrivacyData: {
    id?: string
    section_header: string
    section_description: string
    details: string
  }
  TermsAndPrivacyPayload: FormData


  TermsAndPrivacyResponse: BaseApiResponse & { data: ITermsAndPrivacyCmsModel['TermsAndPrivacyData'] }
  SaveTermsAndPrivacyResponse: BaseApiResponse & { data: ITermsAndPrivacyCmsModel['TermsAndPrivacyData'] }
  UpdateTermsAndPrivacyResponse: BaseApiResponse & { data: ITermsAndPrivacyCmsModel['TermsAndPrivacyData'] }
}
