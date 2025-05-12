export type TimesheetData = {
  _id: string
  booking_id: string
  client_id: string
  staff_id: string
  break_time_id: string
  start_time: string
  end_time: string
  total_hour: number
  signature: string
  client_approved_status: string
  isDeleted: boolean
  status: string
  createdAt: string
  updatedAt: string
  isSigned: boolean
  booking_data: BookingData
  client_data: ClientData
  staff_data: StaffData
  breakTime_data: BreakTimeData
}

export type BookingData = {
  _id: string
  service_id: string
  client_id: string
  staff_id: any
  date: string
  shift_id: string
  start_time: string
  end_time: string
  booking_No: string
  remark: string
  add_by: string
  booking_duration: number
  booked_by_id: string
  isDeleted: boolean
  status: string
  createdAt: string
  updatedAt: string
  break_time_id: string
  isAssigned: boolean
  shift_name: string
}

export type ClientData = {
  _id: string
  full_name: string
}

export type StaffData = {
  _id: string
  full_name: string
  phone: string
  email: string
}

export type BreakTimeData = {
  _id: string
  time_name: string
}
