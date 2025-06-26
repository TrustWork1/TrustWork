import { BaseApiResponse } from 'src/interface/common.interface'

export type ICurrencyModel = {
  CurrencyList: {
    xaf_currency: string
  }
  CurrencyContentPayload: {
    xaf_currency: string
  }
  CurrencyListResponse: BaseApiResponse & { data: ICurrencyModel['CurrencyList'] }
  UpdateCurrencyListResponse: BaseApiResponse & { data: ICurrencyModel['CurrencyList'] }
}
