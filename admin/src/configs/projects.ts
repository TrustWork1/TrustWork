const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/project/list`,
  details: `${BASE_URL}/project/details`,
  store: `${BASE_URL}/project/add/`,
  update: `${BASE_URL}/project/edit`,
  delete: `${BASE_URL}/project/delete`,
  updateStatus: `${BASE_URL}/project/status/change`,

  biding: {
    list: `${BASE_URL}/project/bid`,
    details: `${BASE_URL}/bid/details`,
    updateStatus: `${BASE_URL}/bid/status/change`,
  }
}