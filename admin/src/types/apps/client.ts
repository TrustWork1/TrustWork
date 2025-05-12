// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type TClientType = {
  id: number | string
  first_name: string
  last_name: string
  username: string
  user_type: string
  email: string
  phone: string
  profile_picture?: any
  avatarColor?: ThemeColor
  associated_organization: string
  organization_registration_id: string
  profession: any
  service_details: string
  client_notes: string
  profile_bio: string
  bank_details: any[]
  user_documents: any[]
  memberships: any[]
  user: number
  job_category: any[]
  address: string
  street?: any
  city?: any
  state?: any
  zip_code?: any
  country?: any
  status: string
  is_active: boolean
  is_accepted_terms_conditions: boolean
  last_login?: any
  full_name?: string
}
