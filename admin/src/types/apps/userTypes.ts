// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  _id: string
  first_name: string
  last_name: string
  full_name?: string
  email: string
  secondary_email?: string
  phone: string
  secondary_phone?: string
  profile_image: string
  role: string
  isDeleted: string
  status: string
  avatarColor?: ThemeColor
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}




