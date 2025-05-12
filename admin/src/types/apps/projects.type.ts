import { TClientType } from './client'

export interface ProjectCategory {
  id: number
  created_at: string
  updated_at: string
  status: string
  title: string
  description: string
}

export type TEachProject = {
  id: number
  project_location: number
  created_at: string
  updated_at: string
  project_title: string
  project_description: string
  project_address: string
  project_budget: number
  project_timeline: string
  client: TClientType
  status: string
  client_profile_pic: string
  client_full_name: string
  project_category: ProjectCategory
  can_send_bid: boolean
  bid_cost: string

  longitude: string
  latitude: string
  provider: any
  project_total_cost: any
  project_hrs_week: string

  email: string
  payment_status: string
  street: string
  city: string
  state: string
  state_code: string
  country: string
  zip_code: string

  document: string
  bid: string
  bid_count: number
}

export type ServiceProvider = {
  id: number
  full_name: string
}

export type TEachProjectBidding = {
  id: number
  service_provider: ServiceProvider
  created_at: string
  updated_at: string
  status: string
  bid_details: string
  quotation_details: string
  project_total_cost: string
  time_line: string
  project: number
  can_send_bid: boolean
  bis_sent: boolean
  is_accepted: boolean
  project_title: string
  client_name: string
  time_line_hour: string
  bid_sent: boolean
}
