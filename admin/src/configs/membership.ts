const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/membership-plans`,
  details: `${BASE_URL}/membership-plans`,
  store: `${BASE_URL}/membership-plans/`,
  update: `${BASE_URL}/membership-plans`,
  delete: `${BASE_URL}/membership-plans`,
  updateStatus: `${BASE_URL}/membership-plans`,
}