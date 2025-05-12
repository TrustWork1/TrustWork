export interface UserData {
  email: string
  name: string
  country: string
  password: string
  confirmPassword: string
  contactPerson: string
  contactPersonPhone: string
  state: string
  address: string
  houseNo: string
  phoneNumber: string
  branch: string
  city: string
  landmark: string
  zipCode: string
}

export interface UserFormData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
  permissions: string[]
}
