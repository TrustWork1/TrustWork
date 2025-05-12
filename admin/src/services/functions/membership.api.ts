import axiosInstance from '../interceptors/auth.interceptor'
import { IMembershipListResponse, } from 'src/interface/api.interface'
import { GridFilterItem } from '@mui/x-data-grid';
import membership from 'src/configs/membership';
import { TMembershipAddParam } from 'src/types/apps/membership.type';


export const fetchMembership = async (
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

  const res = await axiosInstance.get<IMembershipListResponse>(`${membership.list}?page=${payload?.page}&limit=${payload?.perpage}&search=${payload.search}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchMembershipById = async (id: null | number | string) => {
  const url = `${membership.details}/${id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeMembership = async (data: TMembershipAddParam) => {
  const res = await axiosInstance.post(membership.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateMembership = async (id: string | number, data: any) => {
  const url = `${membership.update}/${id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteMembership = async (id: string | number) => {
  const url = `${membership.delete}/${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateMembershipStatus = async (data: { id: string | number; status: string }) => {
  const url = `${membership.updateStatus}/${data.id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

