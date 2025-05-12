const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/cms/list`,
  details: `${BASE_URL}/cms/details`,
  store: `${BASE_URL}/cms/add/`,
  update: `${BASE_URL}/cms/edit`,
  updateStatus: `${BASE_URL}/cms/status/change`
}
