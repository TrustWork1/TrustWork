import axios, { AxiosError, AxiosResponse } from 'axios'
import { globalCatchError, globalCatchWarning } from 'src/lib/functions/_helpers.lib'
import { BaseApiResponse } from 'src/interface/common.interface'
import authConfig from 'src/configs/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

const axiosInstance = axios.create({
  baseURL: BASE_URL

  // headers: {
  //   'Content-Type': 'application/json'
  // }
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken')
    console.log(token, 'token')
    if (token && !!config.headers) {
      config.headers['Authorization'] = `Token ${token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response Interceptor with Global Handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<BaseApiResponse>) => {
    // Use global success handler
    // globalCatchSuccess(response)

    return response
  },
  (error: AxiosError<BaseApiResponse>) => {
    if (error.response?.status === 401) {
      globalCatchWarning(error.response)
      if (typeof window !== undefined) {
        window.localStorage.removeItem(authConfig.sessionData)
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        window.location.href = '/login'
      }
    }
    if (error.response?.status === 400) {
      // Handle as warning for specific status codes
      globalCatchWarning(error.response)
    } else {
      // Handle all other errors globally
      globalCatchError(error)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
