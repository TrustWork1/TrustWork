export interface IClient {
  first_name?: string
  last_name?: string
  full_name: string
  email: string
  phone: string
  profile_picture?: any
  client_notes?: string
  address: string
  street?: any
  city: any
  state: any
  zip_code: any
  country: any
  status?: string
  is_accepted_terms_conditions?: boolean
  latitude: string
  longitude: string
}
