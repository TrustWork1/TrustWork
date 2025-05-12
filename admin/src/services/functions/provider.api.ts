import { GridFilterItem } from '@mui/x-data-grid'
import axiosInstance from '../interceptors/auth.interceptor'
import provider from 'src/configs/provider'

export const fetchProviders = async (
  value?: string,
  paginationModel: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
  filters?: GridFilterItem[]
) => {
  const filterQuery = filters?.map(filter => ({
    field: filter.field,
    operator: filter.operator,
    value: filter.value
  }))

  const payload = {
    search: value || '',
    perpage: paginationModel.pageSize,
    page: paginationModel.page,
    filters: filterQuery || []
  }

  const res = await axiosInstance.get(`${provider.list}?page=${payload?.page}&limit=${payload?.perpage}&search=${payload.search}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchProviderById = async (id: null | number | string) => {
  const url = `${provider.details}/${id}/`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeProvider = async (data: any) => {
  const res = await axiosInstance.post(provider.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateProvider = async (id: string | number, data: any) => {
  const url = `${provider.update}/${id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteProvider = async (id: string | number) => {
  const url = `${provider.delete}/${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateProviderStatus = async (data: { id: string | number; status: string }) => {
  const url = `${provider.updateStatus}/${data.id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
