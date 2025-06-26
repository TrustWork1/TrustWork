import currency from 'src/configs/landing-website/home/currency'
import axiosInstance from '../interceptors/auth.interceptor'
import { ICurrencyModel } from '@/type/apps/currencyTypes'

export const fetchCurrencyListContent = async () => {
  const res = await axiosInstance.get<ICurrencyModel['CurrencyListResponse']>(currency.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res?.data
}
export const updateCurrencyContent = async (data: ICurrencyModel['CurrencyContentPayload']) => {
  const url = `${currency.update}`
  const res = await axiosInstance.put<ICurrencyModel['CurrencyListResponse']>(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
