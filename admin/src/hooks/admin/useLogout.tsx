/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminLogoutFn } from 'src/services/functions/admin.api'

type TLogoutProps = {
  optionalCallback?: () => void
}
const useLogout = ({ optionalCallback }: TLogoutProps) => {
  return useMutation({
    mutationKey: ['adminLogoutFn'],
    mutationFn: adminLogoutFn,
    onSuccess: async res => {
      // console.log(res.status, 'rest')
      // if (res.status == 204) {
      toast.success('Signout Successfully')
      optionalCallback ? optionalCallback() : null

      // }
    },
    onError: async () => {
      toast.error('Something went wrong while signout')
    }
  })
}

export default useLogout
