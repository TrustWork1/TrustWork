const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/category`,
  details: `${BASE_URL}/category`,
  store: `${BASE_URL}/category/add/`,
  update: `${BASE_URL}/category/edit`,
  delete: `${BASE_URL}/category/delete`,
  updateStatus: `${BASE_URL}/category/edit`
}
