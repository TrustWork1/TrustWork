const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/service/list`,
  details: `${BASE_URL}/admin/service/details`,
  store: `${BASE_URL}/admin/service/add`,
  update: `${BASE_URL}/admin/service/edit`,
  delete: `${BASE_URL}/admin/service/delete`,
  updateStatus: `${BASE_URL}/admin/service/status/change`
}
