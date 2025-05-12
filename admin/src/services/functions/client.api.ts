import axiosInstance from 'src/services/interceptors/auth.interceptor'
import client from 'src/configs/client'
import { GridFilterItem } from '@mui/x-data-grid'

// export const fetchClients = async () => {
//   const res = await axiosInstance.get(client.list, {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })

//   return res.data
// }


export const fetchClients = async (
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

  const res = await axiosInstance.get(`${client.list}?page=${payload?.page}&limit=${payload?.perpage}&search=${payload.search}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchClientById = async (id: null | number | string) => {
  const url = `${client.details}/${id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeClient = async (data: any) => {
  const res = await axiosInstance.post(client.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateClient = async (id: string | number, data: any) => {
  const url = `${client.update}/${id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteClient = async (id: string | number) => {
  const url = `${client.delete}/${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateClientStatus = async (data: { id: string | number; status: string }) => {
  const url = `${client.updateStatus}/${data.id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
