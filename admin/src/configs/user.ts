const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/subadmin/list`,
  details: `${BASE_URL}/admin/subadmin/details`,
  store: `${BASE_URL}/admin/subadmin/add`,
  update: `${BASE_URL}/admin/subadmin/edit`,
  delete: `${BASE_URL}/admin/subadmin/delete`,
  updateStatus: `${BASE_URL}/admin/subadmin/status/change`
}
