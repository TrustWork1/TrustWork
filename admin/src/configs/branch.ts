const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/branch/list`,
  details: `${BASE_URL}/admin/branch/details`,
  store: `${BASE_URL}/admin/branch/add`,
  update: `${BASE_URL}/admin/branch/edit`,
  delete: `${BASE_URL}/admin/branch/delete`,
  updateStatus: `${BASE_URL}/admin/branch/status/change`
}
