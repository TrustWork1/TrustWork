export type BookingStatus = 'Paid' | string

export type BookingLayoutProps = {
  id: string | undefined
}

export type BookingClientType = {
  name: string
  address: string
  company: string
  country: string
  contact: string
  companyEmail: string
}

export type BookingPaymentType = {
  iban: string
  totalDue: string
  bankName: string
  country: string
  swiftCode: string
}

export type SingleBookingType = {
  Booking: BookingType
  paymentDetails: BookingPaymentType
}

export type BookingType = {
  _id: string
  service_id: string
  client_id: string
  staff_id: string
  date: string
  shift_id: string
  break_time_id: string
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
  client_data: ClientData
  staff_data: StaffData
  service_data: ServiceData
  shift_data: ShiftData
  breakTime_data: BreakTimeData
}

export interface ClientData {
  _id: string
  full_name: string
}
export interface StaffData {
  _id: string
  full_name: string
  phone: string
  email: string
}
export interface ServiceData {
  _id: string
  title: string
  code: string
}

export interface ShiftData {
  _id: string
  name: string
  short_name: string
}

export interface BreakTimeData {
  _id: string
  total_hour: number
  time_name: string
}
