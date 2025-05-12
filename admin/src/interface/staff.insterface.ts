export interface StaffData {
  staff_id?: string
  full_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
  address: string
  landmark: string
  city: string
  state: string
  country: string
  zipcode: string
  start_time: string
  end_time: string
  dob: string
  shift_id: string
  service_ids: string[]
  staff_complieation: StaffComplianceItem[]
}

export interface StaffComplianceItem {
  document_type_id: string
  file: File | null
  isVerified: boolean
  staffcompliance_id: string
}
