import axiosInstance from 'src/services/interceptors/auth.interceptor'
import user from 'src/configs/user'

export const fetchUsers = async (value: string, paginationModel: { page: number; pageSize: number }) => {
  
  const payload = {
    search: value,

    // status: 'Active',
    perpage: paginationModel.pageSize,
    page: paginationModel.page,

    // sort_field: 'string',
    // sort_order: 'desc'
  }

  const res = await axiosInstance.post(`${user.list}`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchUserById = async (id: null | number | string) => {
  const url = `${user.details}/${id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeUser = async (data: any) => {
  const res = await axiosInstance.post(user.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateUser = async (data: any) => {
  const res = await axiosInstance.post(user.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteUser = async (data: { id: string | number }) => {
  console.log('deleteUser payload', data)

  const res = await axiosInstance.post(user.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateUserStatus = async (data: { id: string | number; status: string }) => {
  console.log('updateUserStatus payload', data)
  const res = await axiosInstance.post(user.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
