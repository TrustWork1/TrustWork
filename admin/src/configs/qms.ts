const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/qms/list`,
  replyDetails: `${BASE_URL}/qms/response/details`,
  updateReply: `${BASE_URL}/qms/response/create`,
  details: `${BASE_URL}/qms/details`,
  store: `${BASE_URL}/qms/add/`,
  update: `${BASE_URL}/qms/edit`,
  updateStatus: `${BASE_URL}/qms/status/change`
}
