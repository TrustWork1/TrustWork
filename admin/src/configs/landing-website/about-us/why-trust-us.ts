const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:14208/api'

export default {
  content: `${BASE_URL}/why-you-trustus-cms/`,
  list: `${BASE_URL}/why-you-trustus/`,
  save: `${BASE_URL}/why-you-trustus/`,
  update: `${BASE_URL}/why-you-trustus/`,
  delete: `${BASE_URL}/why-you-trustus/`,
}
