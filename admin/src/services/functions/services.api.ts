import service from 'src/configs/service'
import axiosInstance from 'src/services/interceptors/auth.interceptor'

export const fetchServices = async () => {
  const res = await axiosInstance.post(service.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchServiceById = async (service_id: null | number | string) => {
  const url = `${service.details}/${service_id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeService = async (data: any) => {
  const res = await axiosInstance.post(service.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateService = async (data: any) => {
  const res = await axiosInstance.post(service.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteService = async (data: { service_id: string | number }) => {
  console.log('deleteUser payload', data)

  const res = await axiosInstance.post(service.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateServiceStatus = async (data: { service_id: string | number; status: string }) => {
  console.log('updateUserStatus payload', data)
  const res = await axiosInstance.post(service.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
