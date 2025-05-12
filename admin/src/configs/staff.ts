const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/staff/list`,
  details: `${BASE_URL}/admin/staff/details`,
  store: `${BASE_URL}/admin/staff/add`,
  update: `${BASE_URL}/admin/staff/edit`,
  delete: `${BASE_URL}/admin/staff/delete`,
  updateStatus: `${BASE_URL}/admin/staff/status/change`,
  compliance: `${BASE_URL}/admin/staffcompliance/list`
}
