import axiosInstance from '../interceptors/auth.interceptor'
import { IMembershipListResponse, ITransactionListResponse } from 'src/interface/api.interface'
import { GridFilterItem } from '@mui/x-data-grid'
import membership from 'src/configs/membership'
import { TMembershipAddParam } from 'src/types/apps/membership.type'
import transaction from 'src/configs/transaction'

export const fetchTransaction = async (
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

  const res = await axiosInstance.get<ITransactionListResponse>(
    `${transaction.list}?page=${payload?.page}&limit=${payload?.perpage}&search=${payload.search}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return res.data
}

export const fetchTransactionPerProject = async (
  projectId: string,
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

  const res = await axiosInstance.get<ITransactionListResponse>(
    `${transaction.listAsPerProject}/${projectId}?page=${payload?.page}&limit=${payload?.perpage}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return res.data
}
