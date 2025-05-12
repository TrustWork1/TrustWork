import axiosInstance from 'src/services/interceptors/auth.interceptor'
import permission from 'src/configs/permission'

export const fetchPermissions = async (data: any) => {
  const res = await axiosInstance.post(permission.list, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchPermissionById = async (id: null | number | string) => {
  const url = `${permission.details}/${id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storePermission = async (data: any) => {
  const res = await axiosInstance.post(permission.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updatePermission = async (data: any) => {
  const res = await axiosInstance.post(permission.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deletePermission = async (data: any) => {
  const res = await axiosInstance.post(permission.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
