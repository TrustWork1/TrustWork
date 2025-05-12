import { useRouter } from 'next/router'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import events from 'src/configs/events'
import useEventEmitter from 'src/hooks/useEventEmitter'

export default function EventListeners() {
  const showNotifications = useCallback((data: { message: string; variant: string }) => {
    if (data.variant === 'error') {
      toast.error(data.message)
    }

    if (data.variant === 'success') {
      toast.success(data.message)
    }

    if (data.variant === 'warning') {
      toast.error(data.message)
    }
  }, [])

  const router = useRouter()

  const handleRoutes = useCallback(
    (pathName: string) => {
      router.push(pathName)
    },
    [router]
  )

  useEventEmitter(events.showNotification, showNotifications)
  useEventEmitter(events.routerPush, handleRoutes)

  return null
}
