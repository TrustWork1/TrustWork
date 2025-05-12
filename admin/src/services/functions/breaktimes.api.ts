import axiosInstance from 'src/services/interceptors/auth.interceptor'
import breaktime from 'src/configs/breaktime'

export const fetchBreakTimes = async () => {
  const res = await axiosInstance.post(breaktime.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchBreakTimeById = async (breaktime_id: null | number | string) => {
  const url = `${breaktime.details}/${breaktime_id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeBreakTime = async (data: any) => {
  const res = await axiosInstance.post(breaktime.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateBreakTime = async (data: any) => {
  const res = await axiosInstance.post(breaktime.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteBreakTime = async (data: { breaktime_id: string | number }) => {
  console.log('deleteUser payload', data)

  const res = await axiosInstance.post(breaktime.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateBreakTimeStatus = async (data: { breaktime_id: string | number; status: string }) => {
  console.log('updateUserStatus payload', data)
  const res = await axiosInstance.post(breaktime.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
