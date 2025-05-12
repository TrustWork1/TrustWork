import axiosInstance from 'src/services/interceptors/auth.interceptor'
import booking from 'src/configs/booking'

export const fetchBookings = async () => {
  const res = await axiosInstance.post(booking.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchBookingsWithoutLinkedTimesheet = async () => {
  const res = await axiosInstance.post(booking.listWithoutLinkedTimesheet, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchBookingById = async (booking_id: null | number | string) => {
  const url = `${booking.details}/${booking_id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeBooking = async (data: any) => {
  const res = await axiosInstance.post(booking.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateBooking = async (data: any) => {
  const res = await axiosInstance.post(booking.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteBooking = async (data: { booking_id: string | number }) => {
  console.log('deleteBooking payload', data)

  const res = await axiosInstance.post(booking.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateBookingStatus = async (data: { booking_id: string | number; status: string }) => {
  console.log('updateBookingStatus payload', data)
  const res = await axiosInstance.post(booking.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
