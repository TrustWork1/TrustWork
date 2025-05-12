const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:14208/api'

export default {
  list: `${BASE_URL}/app-info/`,
  save: `${BASE_URL}/app-info/`,
  update: `${BASE_URL}/app-info/`
}
