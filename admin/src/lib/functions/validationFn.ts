import { KeyboardEvent } from 'react'

export const handleAlphaKeys = (event: KeyboardEvent<HTMLInputElement>) => {
  const allowedAlphaKeys = Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  const allowedControlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Space', ' ']

  const isAlphabetic = allowedAlphaKeys.includes(event.key)
  const isControl = allowedControlKeys.includes(event.key)

  const isCtrlV = event.ctrlKey && event.key.toLowerCase() === 'v'

  if ((!isAlphabetic && !isControl) || isCtrlV) {
    event.preventDefault()
  }
}

export const handlePhoneNumberKeys = (event: KeyboardEvent<HTMLDivElement>) => {
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const allowedControlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']

  const isNumeric = allowedKeys.includes(event.key)
  const isControl = allowedControlKeys.includes(event.key)

  if (!isNumeric && !isControl) {
    event.preventDefault()
  }
}

export const handleExperienceKeys = (event: KeyboardEvent<HTMLDivElement>) => {
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const allowedControlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '.']

  const isNumeric = allowedKeys.includes(event.key)
  const isControl = allowedControlKeys.includes(event.key)

  if (!isNumeric && !isControl) {
    event.preventDefault()
  }
}

export const handleNumberKeysOnly = (event: KeyboardEvent<HTMLDivElement>) => {
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
  const allowedControlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']

  const isNumeric = allowedKeys.includes(event.key)
  const isControl = allowedControlKeys.includes(event.key)

  if (!isNumeric && !isControl) {
    event.preventDefault()
  }
}

export const handleNumberKeysOnlyWithDot = (event: KeyboardEvent<HTMLDivElement>) => {
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
  const allowedControlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']

  const isNumeric = allowedKeys.includes(event.key)
  const isControl = allowedControlKeys.includes(event.key)

  const isSingleDecimal = event.key === '.' && !event.currentTarget.innerText.includes('.')

  if (!isNumeric && !isControl && !isSingleDecimal) {
    event.preventDefault()
  }
}

/**
 *
 * Please use this function on client side possibly
 *
 * @param htmlString Takes HTML String
 * @returns true or false if the raw value is greater thank equal to 1
 */
export const parseHTMLDataLength = (htmlString: string) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlString
  const text = (tempDiv.textContent ?? '').trim()
  if (text.length >= 1) {
    return true
  } else {
    return false
  }
}

// 'in_progress' | 'failed' | 'completed'
export const renderPaymentStatus = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'In Progress'
    case 'failed':
      return 'Failed'
    case 'completed':
      return 'Completed'
    default:
      return '-'
  }
}
