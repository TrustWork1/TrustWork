const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/client/list`,
  details: `${BASE_URL}/admin/client/details`,
  store: `${BASE_URL}/admin/client/add/`,
  update: `${BASE_URL}/admin/client/edit`,
  delete: `${BASE_URL}/admin/client/delete`,
  updateStatus: `${BASE_URL}/admin/client/status/change`
}


