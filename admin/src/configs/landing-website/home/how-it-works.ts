const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:14208/api'

export default {
  list: `${BASE_URL}/app-howitworks/`,
  save: `${BASE_URL}/app-howitworks/`,
  update: `${BASE_URL}/app-howitworks/`,
  delete: `${BASE_URL}/app-howitworks/`,
  content: `${BASE_URL}/app-howitworks-cms/`,
}
