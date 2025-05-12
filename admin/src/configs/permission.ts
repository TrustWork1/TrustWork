const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/permission/list`,
  details: `${BASE_URL}/admin/permission/details`,
  store: `${BASE_URL}/admin/permission/add`,
  update: `${BASE_URL}/admin/permission/edit`,
  delete: `${BASE_URL}/admin/permission/delete`,
  update_status: `${BASE_URL}/admin/permission/status/change`
}
