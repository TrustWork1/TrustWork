const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/transection-view`,
  listAsPerProject: `${BASE_URL}/transection-project-view`
}
