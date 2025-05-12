import qmsConfig from 'src/configs/qms'
import { IQMSListResponse, IQMSReplyResponse } from 'src/interface/api.interface'
import axiosInstance from 'src/services/interceptors/auth.interceptor'

export const fetchQms = async () => {
  const res = await axiosInstance.get<IQMSListResponse>(qmsConfig.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchReplyQmsById = async (id: string | number) => {
  const url = `${qmsConfig.replyDetails}/${id}`
  const res = await axiosInstance.get<IQMSReplyResponse>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateReplyQms = async (data: { qms: string; response: string; }) => {
  const url = `${qmsConfig.updateReply}/`
  const res = await axiosInstance.post(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
