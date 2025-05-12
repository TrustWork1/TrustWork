const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/location/list`,
  details: `${BASE_URL}/location/details`,
  store: `${BASE_URL}/location/add`,
  update: `${BASE_URL}/location/edit`,
  delete: `${BASE_URL}/location/delete`,
  updateStatus: `${BASE_URL}/location/status/change`
}
