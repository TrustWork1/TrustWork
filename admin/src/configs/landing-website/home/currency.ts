const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:14208/api'

export default {
  list: `${BASE_URL}/admin/xaf_currency/`,
  update: `${BASE_URL}/admin/xaf_currency/`
}
