const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/breaktime/list`,
  details: `${BASE_URL}/admin/breaktime/details`,
  store: `${BASE_URL}/admin/breaktime/add`,
  update: `${BASE_URL}/admin/breaktime/edit`,
  delete: `${BASE_URL}/admin/breaktime/delete`,
  updateStatus: `${BASE_URL}/admin/breaktime/status/change`
}
