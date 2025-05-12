import projects from 'src/configs/projects'
import axiosInstance from '../interceptors/auth.interceptor'
import { IProjectBidDetailsResponse, IProjectBidListResponse, IProjectListResponse } from 'src/interface/api.interface'
import { GridFilterItem } from '@mui/x-data-grid'

export const fetchProjects = async (
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

  const res = await axiosInstance.get<IProjectListResponse>(
    `${projects.list}?page=${payload?.page}&limit=${payload?.perpage}&search=${payload.search}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return res.data
}

export const fetchProjectById = async (id: null | number | string) => {
  const url = `${projects.details}/${id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeProject = async (data: any) => {
  const res = await axiosInstance.post(projects.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateProject = async (id: string | number, data: any) => {
  const url = `${projects.update}/${id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteProject = async (id: string | number) => {
  const url = `${projects.delete}/${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateProjectStatus = async (data: { id: string | number; status: string }) => {
  const url = `${projects.updateStatus}/${data.id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchProjectsBidList = async (
  id: string | number,
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

  const res = await axiosInstance.get<IProjectBidListResponse>(
    `${projects.biding.list}/${id}?page=${payload?.page}&limit=${payload?.perpage}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return res.data
}

export const fetchProjectsBidById = async (id: string | number) => {
  const url = `${projects.biding.details}/${id}`
  const res = await axiosInstance.get<IProjectBidDetailsResponse>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateProjectBidStatus = async (data: { id: string | number; status: string }) => {
  const url = `${projects.biding.updateStatus}/${data.id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
