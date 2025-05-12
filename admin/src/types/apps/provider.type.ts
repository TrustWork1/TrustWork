import { ThemeColor } from 'src/@core/layouts/types'

export type TCatagory = Record<string, boolean>
export type TJobCategory = {
  job_category__id: number
  job_category__title: string
  times: number
  rating: number
} & TCatagory

export type TProviderType = {
  id: string | number
  last_login: any
  is_active: boolean
  email: string
  first_name: string
  last_name: string
  username: string
  user_type: string
  phone: string
  address: string
  profile_picture: string
  associated_organization: string
  organization_registration_id: string
  service_details: string
  client_notes: string
  profile_bio: string
  bank_details: any[]
  user_documents: any[]
  memberships: any[]
  user: number
  full_name?: string
  avatarColor?: ThemeColor
  status: string
  job_category: TJobCategory[]
  street: string
  profession: string
  city: string
  state: string
  zip_code: string
  country: string
  is_accepted_terms_conditions: boolean
}

export type TProviderServiceOptionType = {
  id: number
  title: string
}
