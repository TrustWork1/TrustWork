import axiosInstance from 'src/services/interceptors/auth.interceptor'
import timeSheet from 'src/configs/timesheet'

export const fetchTimeSheets = async (value?: string, paginationModel?: { page: number; pageSize: number }) => {
  let payload = {}
  if (value || paginationModel) {
    payload = {
      search: value || '',
      perpage: paginationModel?.pageSize,
      page: paginationModel?.page
    }
  }
  const res = await axiosInstance.post(`${timeSheet.list}`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchTimeSheetById = async (timesheet_id: number | string) => {
  const url = `${timeSheet.details}/${timesheet_id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeTimeSheet = async (data: any) => {
  const res = await axiosInstance.post(timeSheet.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateTimeSheet = async (data: any) => {
  const res = await axiosInstance.post(timeSheet.update, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data
}

export const deleteTimeSheet = async (data: { timesheet_id: string | number }) => {
  const res = await axiosInstance.post(timeSheet.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateTimeSheetStatus = async (data: { timesheet_id: string | number; status: string }) => {
  const res = await axiosInstance.post(timeSheet.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
