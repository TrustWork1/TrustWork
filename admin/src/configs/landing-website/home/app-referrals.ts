const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:14208/api'
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL!

export default {
  list: `${BASE_URL}/app-refer-content/`,
  save: `${BASE_URL}/app-refer-content/`,
  update: `${BASE_URL}/app-refer-content/`,
  delete: `${BASE_URL}/app-refer-content/`
}
