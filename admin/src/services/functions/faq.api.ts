import { GridFilterItem } from '@mui/x-data-grid'
import faqConfig from 'src/configs/faq'
import axiosInstance from 'src/services/interceptors/auth.interceptor'

export const fetchFaqs = async (
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
    question: value || '',
    perpage: paginationModel.pageSize,
    page: paginationModel.page,
    filters: filterQuery || []
  }

  const res = await axiosInstance.get(
    `${faqConfig.list}?page=${payload?.page}&limit=${payload?.perpage}&question=${payload.question}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return res.data
}

export const fetchFaqById = async (faq_id: number | string) => {
  const url = `${faqConfig.details}/${faq_id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeFaq = async (data: any) => {
  const res = await axiosInstance.post(faqConfig.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateFaq = async (id: string | number, data: any) => {
  const url = `${faqConfig.update}/${id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteFaq = async (id: string | number) => {
  const url = `${faqConfig.delete}/${id}/`
  const res = await axiosInstance.delete(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateFaqStatus = async (data: { id: string | number; status: string }) => {
  const url = `${faqConfig.updateStatus}/${data.id}/`
  const res = await axiosInstance.put(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
