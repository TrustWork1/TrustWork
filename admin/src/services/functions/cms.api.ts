import cmsConfig from 'src/configs/cms'
import axiosInstance from 'src/services/interceptors/auth.interceptor'

export const fetchCms = async () => {
  const res = await axiosInstance.get(cmsConfig.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchCmsById = async (id: string | number) => {
  const url = `${cmsConfig.details}/${id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeCms = async (data: any) => {
  const res = await axiosInstance.post(cmsConfig.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateCms = async (id: string | number, data: { title: string; content: string; status: string }) => {
  const url = `${cmsConfig.update}/${id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteCms = async (data: any) => {
  const res = await axiosInstance.post(cmsConfig.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateCmsStatus = async (data: { id: string | number; status: string }) => {
  const url = `${cmsConfig.updateStatus}/${data.id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
