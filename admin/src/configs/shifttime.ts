const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/shifttime/list`,
  details: `${BASE_URL}/admin/shifttime/details`,
  store: `${BASE_URL}/admin/shifttime/add`,
  update: `${BASE_URL}/admin/shifttime/edit`,
  delete: `${BASE_URL}/admin/shifttime/delete`,
  updateStatus: `${BASE_URL}/admin/shifttime/status/change`
}
