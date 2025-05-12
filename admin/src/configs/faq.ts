const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/faq/list`,
  details: `${BASE_URL}/faq/details`,
  store: `${BASE_URL}/faq/add/`,
  update: `${BASE_URL}/faq/edit`,
  delete: `${BASE_URL}/faq/delete`,
  updateStatus: `${BASE_URL}/faq/status/change`
}
