import axiosInstance from 'src/services/interceptors/auth.interceptor'
import country from 'src/configs/country'

export const fetchCountries = async () => {
  const res = await axiosInstance.get(country.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchCountryById = async (id: null | number | string) => {
  const url = `${country.details}/${id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeCountry = async (data: any) => {
  const res = await axiosInstance.post(country.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateCountry = async (data: any) => {
  const res = await axiosInstance.post(country.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteCountry = async (data: { country_id: string | number }) => {
  const res = await axiosInstance.post(country.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateCountryStatus = async (data: { country_id: string | number; status: string }) => {
  const res = await axiosInstance.post(country.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
