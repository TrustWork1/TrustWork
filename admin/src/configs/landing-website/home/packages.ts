const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:14208/api'

export default {
  list: `${BASE_URL}/app-packages/`,
  save: `${BASE_URL}/app-packages/`,
  update: `${BASE_URL}/app-packages/`,
  delete: `${BASE_URL}/app-packages/`,
  content: `${BASE_URL}/app-packages-cms/`,
}
