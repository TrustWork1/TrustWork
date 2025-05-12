const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/provider/list`,
  details: `${BASE_URL}/admin/provider/details`,
  store: `${BASE_URL}/admin/provider/add/`,
  update: `${BASE_URL}/admin/provider/edit`,
  delete: `${BASE_URL}/admin/provider/delete`,
  updateStatus: `${BASE_URL}/admin/provider/status/change`
}


