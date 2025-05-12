const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:14208/api'

export default {
  terms: `${BASE_URL}/terms-conditions-cms/`,
  policy: `${BASE_URL}/privacy-policy-cms/`,
}
