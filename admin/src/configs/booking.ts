const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api'

export default {
  list: `${BASE_URL}/admin/booking/list`,
  listWithoutLinkedTimesheet: `${BASE_URL}/admin/booking/list/without-linked-timesheet`,
  details: `${BASE_URL}/admin/booking/details`,
  store: `${BASE_URL}/admin/booking/add`,
  update: `${BASE_URL}/admin/booking/edit`,
  delete: `${BASE_URL}/admin/booking/delete`,
  updateStatus: `${BASE_URL}/admin/booking/status/change`
}
