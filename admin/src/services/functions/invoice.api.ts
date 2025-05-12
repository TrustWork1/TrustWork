import invoice from 'src/configs/invoice'
import axiosInstance from 'src/services/interceptors/auth.interceptor'

export const fetchInvoice = async () => {
  const res = await axiosInstance.post(invoice.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchInvoiceById = async (data: any) => {
  const res = await axiosInstance.post(invoice.details, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeInvoice = async (data: any) => {
  const res = await axiosInstance.post(invoice.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateInvoice = async (data: any) => {
  const res = await axiosInstance.post(invoice.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteInvoice = async (data: any) => {
  const res = await axiosInstance.post(invoice.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
