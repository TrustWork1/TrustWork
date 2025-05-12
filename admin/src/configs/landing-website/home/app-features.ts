const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:14208/api'

export default {
  list: `${BASE_URL}/app-features/`,
  save: `${BASE_URL}/app-features/`,
  update: `${BASE_URL}/app-features/`,
  delete: `${BASE_URL}/app-features/`,
  content: `${BASE_URL}/app-features-cms/`,
}
