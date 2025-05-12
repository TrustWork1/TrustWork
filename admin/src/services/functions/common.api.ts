import common from "src/configs/common"
import axiosInstance from "../interceptors/auth.interceptor"
import { IClientListResponse, TJobCategoryResponseList } from "src/interface/api.interface"

export const commonProviderServices = async () => {
  const res = await axiosInstance.get(common.serviceProviderJobTypeList, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const commonLocationList = async () => {
  const res = await axiosInstance.get(common.locationAllList, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const commonJobCategoriesList = async () => {
  const res = await axiosInstance.get<TJobCategoryResponseList>(common.jobCategoriesAllList, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const commonClientList = async ({ search }: { search: string }) => {
  const url = search === "" ? common.clientAllList : `${common.clientAllList}?search=${search}`
  const res = await axiosInstance.get<IClientListResponse>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const commonProviderList = async ({ search }: { search: string }) => {
  const url = search === "" ? common.providerAllList : `${common.providerAllList}?search=${search}`
  const res = await axiosInstance.get<IClientListResponse>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
