import { DashboardDataType } from '@/type/apps/dashboard'
import { TEachTransaction } from '@/type/apps/transaction.type'
import { UserDataType } from 'src/context/types'
import { TEachCategory } from 'src/types/apps/category.type'
import { TClientType } from 'src/types/apps/client'
import { TEachJobCategory } from 'src/types/apps/common.type'
import { TEachMembership } from 'src/types/apps/membership.type'
import { TEachProject, TEachProjectBidding } from 'src/types/apps/projects.type'
import { TProviderType } from 'src/types/apps/provider.type'
import { TQMSDetails, TQMSEach, TQMSListType } from 'src/types/apps/qms.type'

export interface TJobCategoryResponseList {
  status: string
  message: string
  type: string
  data: TEachJobCategory[]
}
export interface IClientListResponse {
  status: number
  type: string
  message: string
  data: TClientType[]
  total: number
  page: number
  pages: number
  limit: number
}
export interface IProviderListResponse {
  status: number
  type: string
  message: string
  data: TProviderType[]
  total: number
  page: number
  pages: number
  limit: number
}

export interface IUserDetailsResponse {
  status: string
  message: string
  type: string
  data: UserDataType
}
export interface IDashboardDetailsResponse {
  status: string
  message: string
  type: string
  data: DashboardDataType
}

export interface IUserEditResponse {
  status: string
  message: string
  type: string
  data: UserDataType
}

export interface IQMSDetailsResponse {
  status: number
  type: string
  message: string
  data: TQMSListType
}

export interface IQMSReplyResponse {
  status: number
  type: string
  message: string
  data: TQMSDetails
}

export type IQMSListResponse = {
  status: number
  type: string
  message: string
  data: TQMSEach[]
}
export interface IProjectListResponse {
  status: number
  type: string
  message: string
  data: TEachProject[]
  total: number
  page: number
  pages: number
  limit: number
}
export interface IProjectBidListResponse {
  status: number
  type: string
  message: string
  data: TEachProjectBidding[]
  total: number
  page: number
  pages: number
  limit: number
}
export interface IProjectBidDetailsResponse {
  status: string
  message: string
  type: string
  data: TEachProjectBidding
}

export interface IMembershipListResponse {
  status: number
  type: string
  message: string
  data: TEachMembership[]
}

export interface ICategoryListResponse {
  status: number
  type: string
  message: string
  data: TEachCategory[]
  total: number
  page: number
  pages: number
  limit: number
}

export interface IfetchCategoryByIdResponse {
  status: number
  type: string
  message: string
  data: TEachCategory
}

export interface ITransactionListResponse {
  status: number
  type: string
  message: string
  data: TEachTransaction[]
  total: number
  page: number
  pages: number
  limit: number
}
