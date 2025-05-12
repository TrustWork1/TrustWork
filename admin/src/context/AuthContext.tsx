// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  ForgotPasswordParams,
  ResetPasswordParams
} from './types'
import toast from 'react-hot-toast'
import useLogout from 'src/hooks/admin/useLogout'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  const logoutUser = useLogout({
    optionalCallback: () => {
      setUser(null)
      window.localStorage.removeItem(authConfig.sessionData)
      window.localStorage.removeItem(authConfig.storageTokenKeyName)
      router.push('/login')
    }
  })

  useEffect(() => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    if (storedToken) {
      const storedUser = window.localStorage.getItem(authConfig.sessionData)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false) // Token exists, so we're done loading
    } else {
      setLoading(false) // No token, so loading is done
    }
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        response.data
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data?.data?.accessToken)
          : null
        response.data
          ? window.localStorage.setItem(authConfig.sessionData, JSON.stringify(response.data?.data?.UserData))
          : null
        setUser({ ...response.data?.data?.UserData })
        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleForgotPassword = (params: ForgotPasswordParams, errorCallback?: ErrCallbackType) => {
    // console.log('handleLogin params', authConfig.forgotPasswordEndpoint, params)

    axios
      .post(authConfig.forgotPasswordEndpoint, params)
      .then(async response => {
        // console.log('handleLogin response', response.data.status)
        if (response.data.status == 200) {
          toast.success(response.data.data.message)
          const returnUrl = router.query.returnUrl
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL as string)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleResetPassword = (params: ResetPasswordParams, errorCallback?: ErrCallbackType) => {
    // console.log('handle reset password params', authConfig.resetPasswordEndpoint, params)

    axios
      .patch(authConfig.resetPasswordEndpoint, params)
      .then(async response => {
        console.log('handle reset password response', response)
        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    logoutUser.mutateAsync()

    // setUser(null)
    // window.localStorage.removeItem(authConfig.sessionData)
    // window.localStorage.removeItem(authConfig.storageTokenKeyName)
    // router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
