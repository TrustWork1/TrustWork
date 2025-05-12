const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/invoice/list`,
  details: `${BASE_URL}/admin/invoice/details`,
  store: `${BASE_URL}/admin/invoice/edit`,
  update: `${BASE_URL}/admin/invoice/edit`
}
