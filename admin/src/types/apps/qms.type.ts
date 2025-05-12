import { TClientType } from "./client"

export type TQMSEach = {
  id: number
  query: string
  answer: string
  status: string
  updated_at: string
  user: TClientType
}

export type TQMSListType = {
  id: number
  query: string
  answer: string
  status: string
}

export type TQMSDetails = {
  qms: QMS
  response: string
}

type User = {
  full_name: string
  phone: string
  email: string
  user_type: string
}

type QMS = {
  id: number
  query: string
  answer: string
  status: string
  updated_at: string
  user: User
}