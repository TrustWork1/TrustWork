// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export interface StaffType {
  _id: string
  ID: string
  full_name: string
  email: string
  secondary_email: any
  phone: string
  secondary_phone: any
  profile_image?: string
  avatarColor?: ThemeColor
  contract_number: any
  contract_document: any
  status: string
  isDeleted: boolean
  createdAt: string
  user_role: UserRole
  service_data: ServiceData[]
}

export interface UserRole {
  _id: string
  role: string
  roleDisplayName: string
}

export interface ServiceData {
  _id: string
  title: string
}
