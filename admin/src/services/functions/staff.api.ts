import axiosInstance from 'src/services/interceptors/auth.interceptor'
import staff from 'src/configs/staff'

export const fetchStaffs = async (value?: string, paginationModel?: { page: number; pageSize: number }) => {
  let payload = {}
  if (value || paginationModel) {
    payload = {
      search: value || '',
      perpage: paginationModel?.pageSize,
      page: paginationModel?.page
    }
  }
  const res = await axiosInstance.post(`${staff.list}`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchStaffById = async (user_id: number | string) => {
  const url = `${staff.details}/${user_id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeStaff = async (data: any) => {
  const res = await axiosInstance.post(staff.store, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data
}

export const updateStaff = async (data: any) => {
  const res = await axiosInstance.post(staff.update, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data
}

export const deleteStaff = async (data: { user_id: string | number }) => {
  const res = await axiosInstance.post(staff.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateStaffStatus = async (data: { user_id: string | number; status: string }) => {
  const res = await axiosInstance.post(staff.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchCompliance = async (data: any) => {
  const res = await axiosInstance.post(staff.compliance, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
