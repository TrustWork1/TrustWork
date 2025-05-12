export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type ForgotPasswordParams = {
  email: string
}

export type ResetPasswordParams = {
  email: string
  token: string
  new_password: string
  confirm_password: string
}

export type UserDataType = {
  id: number | string
  first_name: string
  last_name: string
  full_name: string
  username: string
  email: string
  groups: Group
  password: string
  last_login: string
  is_superuser: boolean
  otp: string | number
  user_type: string
  is_active: boolean
  is_staff: boolean
  date_joined: string

  phone: string
  address: string
  profile_picture: any
  city: string
  state: string
  zip_code: string
  country: string





  total_referal_amount: string
  total_referal_count: string
  is_user_active: boolean
  user_referal_code: string
  referred_by_code: any
  notification_enabled: boolean
  cover_image: any
  associated_organization: any
  feedback: any[]
  organization_registration_id: any
  service_details: any
  client_notes: any
  profile_bio: any
  bank_details: any[]
  user_documents: any[]
  memberships: any[]
  user: number
  status: string
  job_category: any[]
  street: any
  profession: any
  is_accepted_terms_conditions: boolean
  is_payment_verified: boolean
  is_profile_updated: boolean
  profile_rating: number
  year_of_experiance: any
  latitude: string
  longitude: string
  completed_project: number
}

export type Group = {
  id: number
  name: string
  permissions: {
    id: string
    permissionName: string
    permissionKey: string
    desc: string
    isDeleted: boolean
    status: string
    createdAt: string
    updatedAt: string
  }[]
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  forgotPassword: (params: ForgotPasswordParams, errorCallback?: ErrCallbackType) => void
  resetPassword: (params: ResetPasswordParams, errorCallback?: ErrCallbackType) => void
}
