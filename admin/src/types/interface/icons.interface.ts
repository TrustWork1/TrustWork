export interface CustomIconProps {
  IconColor?: string
  IconWidth?: string
  IconHeight?: string
}

export interface Features {
  displayIndex?: number
  title: string
  description: string
  icon: string | File | undefined
}
