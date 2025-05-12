import shiftTime from 'src/configs/shifttime'
import axiosInstance from 'src/services/interceptors/auth.interceptor'

export const fetchShiftTime = async () => {
  const res = await axiosInstance.post(shiftTime.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchShiftTimeById = async (shift_id: null | number | string) => {
  const url = `${shiftTime.details}/${shift_id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeShiftTime = async (data: any) => {
  const res = await axiosInstance.post(shiftTime.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateShiftTime = async (data: any) => {
  const res = await axiosInstance.post(shiftTime.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteShiftTime = async (data: { shift_id: string | number }) => {
  console.log('deleteUser payload', data)

  const res = await axiosInstance.post(shiftTime.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateShiftTimeStatus = async (data: { shift_id: string | number; status: string }) => {
  console.log('updateUserStatus payload', data)
  const res = await axiosInstance.post(shiftTime.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
