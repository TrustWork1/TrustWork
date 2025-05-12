import axiosInstance from '../interceptors/auth.interceptor'
import { ICategoryListResponse, IfetchCategoryByIdResponse } from 'src/interface/api.interface'
import { GridFilterItem } from '@mui/x-data-grid'
import category from 'src/configs/category'
// import { TCategoryAddParam } from 'src/types/apps/category.type';

export const fetchCategories = async (
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

  const res = await axiosInstance.get<ICategoryListResponse>(
    `${category.list}?page=${payload?.page}&limit=${payload?.perpage}&search=${payload.search}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return res.data
}

export const fetchCategoryById = async (id: null | number | string) => {
  const url = `${category.details}/${id}/`
  const res = await axiosInstance.get<IfetchCategoryByIdResponse>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeCategory = async (data: FormData) => {
  // export const storeCategory = async (data: TCategoryAddParam) => {
  const res = await axiosInstance.post(category.store, data, {
    // headers: {
    //   'Content-Type': 'application/json'
    // }
  })

  return res.data
}

export const updateCategory = async (id: string | number, data: FormData) => {
  // export const updateCategory = async (id: string | number, data: any) => {
  const url = `${category.update}/${id}/`
  const res = await axiosInstance.put(url, data, {
    // headers: {
    //   'Content-Type': 'application/json'
    // }
  })

  return res.data
}

export const deleteCategory = async (id: string | number) => {
  const url = `${category.delete}/${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateCategoryStatus = async (data: { id: string | number; status: string }) => {
  const url = `${category.updateStatus}/${data.id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
