import branch from 'src/configs/branch'
import axiosInstance from 'src/services/interceptors/auth.interceptor'

export const fetchBranches = async () => {
  const res = await axiosInstance.post(branch.list, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const fetchBranchById = async (id: null | number | string) => {
  const url = `${branch.details}/${id}`
  const res = await axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const storeBranch = async (data: any) => {
  const res = await axiosInstance.post(branch.store, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateBranch = async (data: any) => {
  const res = await axiosInstance.post(branch.update, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const deleteBranch = async (data: { branch_id: string | number }) => {
  console.log('deleteUser payload', data)

  const res = await axiosInstance.post(branch.delete, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const updateBranchStatus = async (data: { branch_id: string | number; status: string }) => {
  console.log('updateUserStatus payload', data)
  const res = await axiosInstance.post(branch.updateStatus, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
