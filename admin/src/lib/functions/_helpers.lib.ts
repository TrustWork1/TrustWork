import { Features } from '@/type/interface/icons.interface'
import { AxiosError, AxiosResponse } from 'axios'
import events from 'src/configs/events'
import eventEmitter from 'src/event/event.emitter'
import { BaseApiResponse } from 'src/interface/common.interface'

export function checkWindow() {
  return typeof window !== 'undefined'
}

export function isInServer() {
  return typeof document === 'undefined'
}

export function isApple() {
  if (typeof navigator === 'undefined') {
    return false
  }
  const platformExpression = /Mac|iPhone|iPod|iPad/i
  const agent = navigator.userAgent

  return platformExpression.test(agent)
}

export function isAppleSafari() {
  if (typeof navigator === 'undefined') {
    return false
  }

  const rejectedExpression = /Chrome|Android|CriOS|FxiOS|EdgiOS/i
  const expectedExpression = /Safari/i

  const agent = navigator.userAgent
  if (rejectedExpression.test(agent)) {
    return false
  }

  return isApple() && expectedExpression.test(agent)
}

export const globalCatchSuccess = (response: AxiosResponse<BaseApiResponse>) => {
  let message = 'Something went wrong'
  if (response?.data?.message) {
    message = response?.data.message
  }
  eventEmitter.emit(events.showNotification, {
    message,
    variant: 'success'
  })
}

export const globalSuccess = (message: string) => {
  eventEmitter.emit(events.showNotification, {
    message,
    variant: 'success'
  })
}

export const globalCatchWarning = (response: AxiosResponse<BaseApiResponse>) => {
  let message = 'Something went wrong'
  if (response?.data?.message) {
    message = response?.data.message
  }
  if (response?.data?.data && typeof response.data.data === 'object') {
    const fieldErrors = response?.data?.data
    const errorMessages: string[] = []

    Object.entries(fieldErrors).forEach(([_field, errors]) => {
      if (Array.isArray(errors) && errors.length > 0) {
        // const formattedField = field
        //   ?.split('_')
        //   .map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))
        //   .join(' ')

        // Add each error message with the field name
        errors.forEach(error => {
          errorMessages.push(`${error}`)
        })
      }
    })

    // If we found field-specific errors, use them instead of the general message
    if (errorMessages.length > 0) {
      message = errorMessages.join('\n')
    }
  }
  eventEmitter.emit(events.showNotification, {
    message,
    variant: 'error'
  })
}

export const globalWarning = (message: string) => {
  eventEmitter.emit(events.showNotification, {
    message,
    variant: 'warning'
  })
}

export const globalCatchError = (error: AxiosError<BaseApiResponse>) => {
  let message = 'Something went wrong'
  if (error.response?.data?.message) {
    message = error.response?.data.message
  }
  eventEmitter.emit(events.showNotification, {
    message,
    variant: 'error'
  })
}

export const globalError = (message: string) => {
  eventEmitter.emit(events.showNotification, {
    message,
    variant: 'error'
  })
}

export const addDisplayIndexToArray = (features: Features[]): Features[] => {
  return features.map((item, index) => ({
    ...item,
    displayIndex: index + 1
  }))
}
